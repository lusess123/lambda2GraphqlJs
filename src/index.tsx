import recast from 'recast'
import { rootGrpahqlCodeMaker } from './../src/creator'
import { IDBQuery } from './../src/graphql-type'
import './../test/creator.test'

const linqExpress1 = (db: any) => db.Users.filter((u: any) => u.Id === 4).map(({name}) => ({name}))
const code = linqExpress1.toString()
const ast = recast.parse(code)
// const fun  = ast.program.body[0]
// tslint:disable-next-line: no-console
// console.log(code)
// // tslint:disable-next-line:no-console
// console.log(ast)
let DBParam = ''
const query: IDBQuery = { rootTable : { name: '', fields: []}}
recast.visit(ast, {
    // visitArrowFunctionExpression(a) {
    //  if (a.name === 'expression') {
    //     DBParam = a.value.params[0].name
    //     console.log(a)
    //  }
    //  this.traverse(a)
    // },

    visitIdentifier(a) {
        this.traverse(a)
    },

    visitExpression(a) {
         if (a.name === 'expression') {
          DBParam = a.value.params[0].name
         }
         if (a.name === 'callee') {
            if (a!.value!.object!.object && a!.value!.object!.object!.name === DBParam)
            query.rootTable.name = a.value.object.property.name
         }
         console.log(a)
         this.traverse(a)
    },
})

if (query.rootTable.fields.length === 0) {
    query.rootTable.fields = [{name: 'id'}, {name: 'name'}]
}

console.log(rootGrpahqlCodeMaker(query))

export enum ExpressionType {

}
// alert(JSON.stringify(ast))
// console.log(JSON.parse(JSON.stringify(ast)))
// tslint:disable-next-line:no-console
// console.log(recast.print(fun.expression.body.body[0].argument.arguments[0].body.body[0]).code)

// tslint:disable-next-line:ban-types
export class Expression<T extends Function> {
    public readonly CanReduce: boolean
    public Name: string
    public Body: Expression<T>
    public Parameters: string[]
    public NodeType: ExpressionType
   // tslint:disable-next-line:ban-types
    constructor(public Type: T) {
    const code = this.Type.toString()
    const ast = recast.parse(code)
    const ArrowFunctionExpression = ast.program.body[0].expression
    this.Parameters = ArrowFunctionExpression.params.map((a: any) => a.name)
    // ast.body[0]
   }

    public Compile() {
       return this.Type
   }
}

export interface IQueryProvider {
    CreateQuery(expression: Expression<any>): IQueryable<any>
    Execute(expression: Expression<any>): any
}

export interface IQueryable<T> extends Iterable<T> {

    readonly Expression: Expression < any >
    readonly Provider: IQueryProvider,
}

const expression2 = new Expression((a: number, b: number) => a + b)
const fun2 = expression2.Compile()
// alert(fun2(1, 2))
// ---------------------------
