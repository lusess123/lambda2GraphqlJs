import { extendFunction, gql, ILinqDb, Lambda } from './../src/index'
import { Db} from './db'

const print = (code) => {
  document.writeln(`<pre><code>${code}</code></pre>`)
}

const code = gql((a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name, Id})))
// tslint:disable-next-line:no-console
console.log(code)
print(((a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name, Id}))).toString())
print(code)
/*
 {
     Users  {

       Mobile,
       Name,
       Id

     }
   }
*/

const lambda1 = new Lambda<Db>(
  ((a) =>  a.Users.filter((a) => a.Mobile === '1232323').map(({ Id, Mobile, Name}) => ({ Mobile}))),
  )
// tslint:disable-next-line:no-console
console.log(lambda1.gql())
print(((a) =>  a.Users.filter((a) => a.Mobile === '1232323').map(({ Id, Mobile, Name}) => ({ Mobile}))).toString())
print(lambda1.gql())

/*
 {
     Users (Mobile = 1232323) {

       Mobile

     }
   }
*/

extendFunction()
const lambda: ILinqDb<Db> = (a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name}))
// tslint:disable-next-line:no-console
console.log(lambda.gql())
print((a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name})).toString())
print(lambda.gql())

/*
{
     Users  {

       Mobile,
       Name

     }
   }
*/
