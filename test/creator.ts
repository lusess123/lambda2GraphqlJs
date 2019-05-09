import { rootGrpahqlCodeMaker } from '../src/creator'
import { IDBQuery } from '../src/graphql-type'

const Query: IDBQuery = {
    rootTable: {
      name: 'user',
      fields: [
         { name: 'id'},
         { name: 'name'},
         { name: 'mobile'},
      ],
    },
}

const code = rootGrpahqlCodeMaker(Query)
console.log(code)
