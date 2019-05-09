
import { rootGrpahqlCodeMaker } from '../src/creator'
import { gql } from '../src/index'
import { Db} from './db'

test('gql function ', () => {
  const code = gql<Db>((a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name, Id})))
  expect(code).toBe(rootGrpahqlCodeMaker({
    rootTable: {
      name: 'Users',
      fields: [
        {name: 'Mobile'}, {name: 'Name'}, {name: 'Id'},
      ],
    },
  }))
})

test('gql where function ', () => {
  const code = gql<Db>((a) =>  a.Users.filter((a) => a.Id === '4').map(({ Id, Mobile, Name}) => ({ Mobile, Id})))
  expect(code).toBe(rootGrpahqlCodeMaker({
    rootTable: {
      name: 'Users',
      where: [{key: 'Id', value: '4'}],
      fields: [
        {name: 'Mobile'}, {name: 'Id'},
      ],
    },
  }))
})
