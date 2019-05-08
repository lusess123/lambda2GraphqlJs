import React from 'react'
import ReactDOM from 'react-dom'
import ReactJson from 'react-json-view'
import recast from 'recast'
import { rootGrpahqlCodeMaker } from './../src/creator'
import { IDBQuery } from './../src/graphql-type'
import './../test/creator.test'
import { Db, User  } from './../test/db.test'

type ILinqDb<TDb = any> = (db: TDb) => void
declare global {
    // tslint:disable-next-line:interface-name
    interface Function {
        gql(db?: any): string
    }
}

Function.prototype.gql = function (db?: any) {
    const code = this.toString()
    const ast = recast.parse(code)
    let DBParam = ''
    const query: IDBQuery = { rootTable : { name: '', fields: []}}
    recast.visit(ast, {
    visitExpression(a) {
         if (a.name === 'expression') {
          // 第一个传入参数
          DBParam = a.value.params[0].name
          // 找到map 字段集合
          const mapArgs =  a.value.body.arguments[0].body.properties.map((a) => a.key.name)
          query.rootTable.fields = mapArgs.map((a) => ({ name : a}))

         }

         if (a.name === 'callee' && a!.value!.object!.object && a!.value!.object!.object!.name === DBParam)
                query.rootTable.name = a.value.object.property.name

        //  if (a.name === 'body' && a.parentPath.name ===  'expression') {

        //  }

        //  if (a.name === 'callee') {
        //     // 第一个callee 一定是返回值，判断下是否是map
        //     if (a.value.property && a.value.property.name === 'map') {

        //     } else {
        //         if (a!.value!.object!.object && a!.value!.object!.object!.name === DBParam)
        //         query.rootTable.name = a.value.object.property.name
        //     }

        //  }
         // tslint:disable-next-line:no-console
         console.log(a)
         this.traverse(a)
    },
})

    if (query.rootTable.fields.length === 0) {
    query.rootTable.fields = [{name: 'id'}, {name: 'name'}]
}
    const res = rootGrpahqlCodeMaker(query)
    return res
}

const LinqExpression1: ILinqDb<Db> = (db) =>
 db.Users.filter((u) => u.Id === '4').map(({Name, Mobile}) => ({Name, Mobile}))
console.log(LinqExpression1.gql())

// ---------------------------

const App = () => {
    const my_json_object = {aaa: 123}
    return (
    <>
    <ReactJson src={{json : '123'}} />
         </>)
}

ReactDOM.render(
    <App/>,
    document.getElementById('app'),
  )
