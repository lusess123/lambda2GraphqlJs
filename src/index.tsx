import recast from 'recast'
const db: any = {}
const linqExpress1 = () => db.Users.filter((u: any) => u.Id === 4).map((a: any) => ({ id: a.id }))
const code = linqExpress1.toString()
const ast = recast.parse(code)
// const fun  = ast.program.body[0]
// tslint:disable-next-line: no-console
console.log(code)
// tslint:disable-next-line:no-console
console.log(ast)
// tslint:disable-next-line:no-console
// console.log(recast.print(fun.expression.body.body[0].argument.arguments[0].body.body[0]).code)
