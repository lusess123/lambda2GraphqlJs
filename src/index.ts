import recast from 'recast'
import { rootGrpahqlCodeMaker } from './creator'
import { IDBQuery } from './graphql-type'

export type ILinqDb<TDb = any> = (db: TDb) => void
export function gql<TDb = any>(fun: ILinqDb<TDb>): string {
  const code = fun.toString()
  const ast = recast.parse(code)
  let DBParam = ''
  const query: IDBQuery = { rootTable : { name: '', fields: []}}
  recast.visit(ast, {
                visitExpression(a) {
                  if (a.name === 'expression') {
                    // 第一个传入参数
                     DBParam = a.value.params[0].name
                      // 找到map 字段集合
                     if (a.value.body.callee.property.name === 'map') {
                         const mapArgs =  a.value.body.arguments[0].body.properties.map((a) => a.key.name)
                         query.rootTable.fields = mapArgs.map((a) => ({ name : a}))
                      }
                  }
                  if (a.name === 'callee' && a!.value!.object!.object && a!.value!.object!.object!.name === DBParam) {
                     query.rootTable.name = a.value.object.property.name
                     if (a.value.property.name === 'filter') {
                        if (a.parentPath.value.arguments[0].body.operator === '===') {
                          const filterName = a.parentPath.value.arguments[0].body.left.property.name
                          const filterValue = a.parentPath.value.arguments[0].body.right.value
                          query.rootTable.where = [{ key: filterName , value: filterValue}]
                        }
                      }
                  }
                  this.traverse(a)
                },
  })

  // if (query.rootTable.fields.length === 0) {
  //     query.rootTable.fields = [{name: 'id'}, {name: 'name'}]
  // }
  const res = rootGrpahqlCodeMaker(query)
  return res
}

export class Lambda<TDb = any> {

     constructor(private fun: ILinqDb<TDb>) {

     }
     public gql(): string {
      return gql(this.fun)
    }
}
declare global {
    // tslint:disable-next-line:interface-name
    interface Function {
        gql(db?: any): string
    }
}

export const extendFunction = () => {
   if (!Function.prototype.gql)
   Function.prototype.gql = function() {
      return gql(this)
    }
}
