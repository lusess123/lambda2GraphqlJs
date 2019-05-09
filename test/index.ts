import { createJestPreset} from 'ts-jest'

import { extendFunction, gql, ILinqDb, Lambda } from './../src/index'
import { Db} from './db'

const code = gql((a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name, Id})))
// tslint:disable-next-line:no-console
console.log(code)

const lambda1 = new Lambda<Db>(
  ((a) =>  a.Users.filter((a) => a.Mobile === '1232323').map(({ Id, Mobile, Name}) => ({ Mobile}))),
  )
// tslint:disable-next-line:no-console
console.log(lambda1.gql())

extendFunction()
const lambda: ILinqDb<Db> = (a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name}))
// tslint:disable-next-line:no-console
console.log(lambda.gql())
