import recast from 'recast';
import { rootGrpahqlCodeMaker } from './creator';
export function gql(fun) {
    const code = fun.toString();
    const ast = recast.parse(code);
    let DBParam = '';
    const query = { rootTable: { name: '', fields: [] } };
    recast.visit(ast, {
        visitExpression(a) {
            if (a.name === 'expression') {
                // 第一个传入参数
                DBParam = a.value.params[0].name;
                // 找到map 字段集合
                if (a.value.body.callee.property.name === 'map') {
                    const mapArgs = a.value.body.arguments[0].body.properties.map((a) => a.key.name);
                    query.rootTable.fields = mapArgs.map((a) => ({ name: a }));
                }
            }
            if (a.name === 'callee' && a.value.object.object && a.value.object.object.name === DBParam) {
                query.rootTable.name = a.value.object.property.name;
                if (a.value.property.name === 'filter') {
                    if (a.parentPath.value.arguments[0].body.operator === '===') {
                        const filterName = a.parentPath.value.arguments[0].body.left.property.name;
                        const filterValue = a.parentPath.value.arguments[0].body.right.value;
                        query.rootTable.where = [{ key: filterName, value: filterValue }];
                    }
                }
            }
            this.traverse(a);
        },
    });
    // if (query.rootTable.fields.length === 0) {
    //     query.rootTable.fields = [{name: 'id'}, {name: 'name'}]
    // }
    const res = rootGrpahqlCodeMaker(query);
    return res;
}
export class Lambda {
    constructor(fun) {
        this.fun = fun;
    }
    gql() {
        return gql(this.fun);
    }
}
export const extendFunction = () => {
    if (!Function.prototype.gql)
        Function.prototype.gql = function () {
            return gql(this);
        };
};
