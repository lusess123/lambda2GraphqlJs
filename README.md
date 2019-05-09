
# lambda2Graphql

js版本的Linq to Graphql

# 如何使用

``` js

   npm i  lambda2graphqljs

```

``` js

import { extendFunction, gql, ILinqDb, Lambda } from 'lambda2graphqljs'

export class User {
   public Id: string
   public Name: string
   public Mobile: string
}

// tslint:disable-next-line: max-classes-per-file
export class Db {
   public Users: User[]
}
// 当作函数使用
const code = gql((a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name, Id})))
// tslint:disable-next-line:no-console
console.log(code)

// 封装成对象使用
const lambda1 = new Lambda<Db>(
  ((a) =>  a.Users.filter((a) => a.Mobile === '1232323').map(({ Id, Mobile, Name}) => ({ Mobile}))),
  )
// tslint:disable-next-line:no-console
console.log(lambda1.gql())

// 扩展方法使用
extendFunction()
const lambda: ILinqDb<Db> = (a) =>  a.Users.map(({ Id, Mobile, Name}) => ({ Mobile, Name}))
// tslint:disable-next-line:no-console
console.log(lambda.gql())


```

# 设计思路

## 灵感来源于 C# 的 Linq to SQL

``` js

{
  user(Id: 4) {
    id
    name
    profilePic(size: 100)
  }
}

```

The above GraphQL query could be translated to:

``` js
db.Users
  .Where(u => u.Id == 4)
  .Select(u => new
  {
      id = u.Id,
      name = u.Name,
      profilePic = db.ProfilePics
                     .FirstOrDefault(p => p.UserId == u.Id && p.Size == 100)
                     .Url
  })
  .FirstOrDefault();
  
  ```
  
  这个接口返回不是立即执行的，而是一个表达式，最终会转化为sql语句给数据库
  也就是说上面的c# 表达式跟sql语句是互相等价的， 
  
  如果这个换成js版本的就是：
  
  ```js
  db.Users
  .filter(u => u.Id == 4)
  .map(u => {
    return
    {
      id : u.Id,
      name : u.Name,
      profilePic : db.ProfilePics
                     .find(p => p.UserId == u.Id && p.Size == 100)
                     .Url
    }
   })
  .find(()=> true);
  
  ```
  
  然后把sql 语句换成graphql字符
  
## 那能否把 js 函数语句 变回 graphql字符串呢？
  
## 首先，高阶函数包装

  ``` js
  
   const linqExpress1 = () => {return db.Users.filter(u => u.Id === 4).map(a => { return { id:a.id } }) }

```
  
## 然后，通过 Function.toString()  获取 Native Code 分析表达式源码，转成真正的 graphql 语句
  
  ```js

  linqExpress1.toString()
  
  // "() => {  return db.Users.filter(u => u.Id === 4).map(a => { return { id:a.id } }) } "
```
  
## AST代码转换
  
```js
  "() => {  return db.Users.filter(u => u.Id === 4).map(a => { return { id:a.id } })}"
  ```
  
  换成
  
```js

   {
  user(Id: 4) {
    id
  }
}

```

# 好处
  
1. 受限的Lambda 的语句可读性强，更重要的是支持ts 泛型 静态类型检测
2. 支持map 默认所有字段，不需要显示声明字段
