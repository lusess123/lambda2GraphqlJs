# linq2Graphql
js版本的Linq to Graphql

# 设计思路

## 灵感来源于 C# 的 Linq to SQL
```
{
  user(id: 4) {
    id
    name
    profilePic(size: 100)
  }
}
```
The above GraphQL query could be translated to:
```
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
  
  如何这个换成js的就是：
  
  ```
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
  
  
  
  ## 通过 js 的Function.ToString()  获取 Native Code 分析表达式源码，转成真正的 graphql 语句
  
  ```
  const linqExpress1 = () => {  return   db.Users.filter(u => u.Id === 4).map(a => { return { id:a.id } })  } 
  
  linqExpress1.toString()   // "() => {  return   db.Users.filter(u => u.Id === 4).map(a => { return { id:a.id } })  } "
                                                         
  ```
  
  ## 代码转换
  
  ```
  "() => {  return   db.Users.find(u => u.Id === 4) }"
  ```
  
  换成
  
   ```
   {
  user(id: 4) {
    id
  }
}

   ```
  # 好处
  
  1.  受限的Lambda 的语句可读性强，更重要的是支持ts静态类型检测
  2.  支持map 默认所有字段，不需要显示声明所有字段
  
  
  
