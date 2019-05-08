import { IDBQuery } from './graphql-type'

export const rootGrpahqlCodeMaker = (query: IDBQuery) => {
   return `
   {
     ${query.rootTable.name} {
         ${query.rootTable.fields.map((a) => {
           return  '\n       ' + a.name
         }).join(',')}

     }
   }
   `
}
