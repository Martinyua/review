## nodejs和javascript的区别
* ECMAScript是语法规范
* nodejs=ECMAScript+nodejs API
* JavaScript=ECMAScript+Web API

## commonjs
* module.export={}
* const {} = require('./xxx')

## debugger
* vscode
* 打断点

## server开发和前端开发的区别
* 服务端的稳定性
* 考虑内存和cpu（优化和扩展）
* 日志记录
* 安全
* 集群和服务拆分

## 技术方案
* 数据如何**存储**
* 如何与前端对接，即**接口**设计

## Promise

* 基本语法
* 解决callback hell

```javascript
function  promiseTest (){
    return new Promise ((resolve,reject) =>{ //传入的两个参数都是方法
        resolve(xxx) //成功则返回
        reject(xxx)//失败则返回
    })
}

//使用Promise
promiseTest（x）.then(xxx =>{  //通过.then拿到第一个参数返回的数据
    console.log(xxx)
    return xxx; //返回普通对象
}).then(xxx =>{
    console.log(xxx) //通过then拿到第一个then返回的数据
    return promiseTest(otherx) //这里返回的是promise实例
}).then(xxx =>{
    console.log(otherxxx) //拿到另一个promise对象
})


```



## 接口
* nodejs处理http请求
* 搭建开发环境
* 开发接口
* http请求概述 
1. DNS解析，建立TCP连接（三次握手），发送http请求
2. server接受到http请求，处理，并返回
3. 客户端接受到返回的数据，处理数据（如渲染。执行js）

## nodejs处理http请求
1. get请求和querystring
    * get请求，即客户端要向server端获取数据，如查询博客列表
    * 通过querystring来传递数据，如a.html？a=100&b=200
    * 浏览器直接访问，就发送get请求
      * 常用api及方法
    ```js
        req.method 请求的方法
        req.url //请求的地址
        res.end//返回
    	url.split('?') [0] //获取路由的path
        querystring.parse(url.split('?')[1]) //获取get请求的query，通过querystring.parse()获取解析
    ```

2. post请求和postdata
    * post请求，即客户端要向客服端传递数据，如新建博客
    * 通过postdata传递数据
    * postData数据大小不定，可能会很大，所以需要用到**流的形式传递**
    * 浏览器无法直接进行，需要手写js，或者使用postman
    * 
    ```javascript
        req.method //请求的方法
    
        postData //数据流
        
        req.on //请求的事件，接受数据流和数据流结束(data,end)
    	
    	res.setHeader('Content-type','application/json') //设置返回数据的格式为JSON
    
    	let postData = ''
    	req.on('data', chunk =>{
        	postData += chunk.toString()
    	})	//接受数据流事件
    
    	req.on('end',() =>{
    	console.log('request is end')
        })	//请求结束时触发的时间
    
        res.end(
        	JSON.stringfy(resData)
        )	//返回数据的时候需要转化为JSON字符串类型
    
    	
    ```

3. 路由

    ```javascript
        const path = url.split('?')[0]
        const query = querystring.parse(url.split('?')[1])
    ```

4. req和res

   * http.creatServer()接受一个回调函

   * 回调函数的两个参数就是req，和res（分别对应request和response）

   * 常用的几个api

     req.method

     req.url

     req.on('data',() =>{})

     req.on('end',() =>{})

     res.setHeader() 	//设置返回格式

     res.end（JSON.stringfy(resData)）	//返回数据

## 开发环境

* 将www.js和app.js两个文件夹分开

* www.js负责http.createServer()的一些配置，以及传入函数

* ```javascript
  const http = require('http')
  
  const serverHandle=require('../app')
  
  const PORT = 8000
  
  const server = http.createServer(serverHandle)
  
  server.listen(PORT)
  ```

  

* app.js负责业务逻辑，以及req，res的相关操作

* 使用nodemon监测文件变化，自动重启node

* 使用cross-env设置环境变量，兼容mac linux和windows

## 开发接口
* 初始化路由：根据之前技术方案的设计，做出路由
```javascript
    //取出method，url，path
    const method = req.method
    const url = req.url
    const path = url.split('?')[0]

    //获取博客列表
    if(method === 'GET' && path === '/api/blog/list'){
        return{
            msg:'这是获取博客列表的接口'
        }
    } 
```
* 返回假数据：将路由和数据处理分离，以符合设计原理  

## 路由和API

* API：
    * 前端和后端,不同端（子系统）之间对接的一个术语
    * url（路由） 'api/blog/list' get,输入，输出
* 路由：
    * API的一部分
    * 后端系统内部的一个模块

## MySQL数据库
* 如何建库，建表
* 建表时常用数据类型(int bigint varchar longtext)
* sql 语句实现增删改查

## cookie
- 存储在浏览器的一段字符串
- 跨域不共享
- 格式如k1=v1;k2=v2;k3=v3;因此可以存储结构化的数据
- 每次发送http请求，会将请求域的cookie一起发送给server
- server可以修改cookie并返回给浏览器
- 浏览器中也可以通过JavaScript修改cookie（有限制）
- 设置cookie的生效路由path，设置cookie仅服务端可以修改，设置cookie的过期时间

## session
- 直接使用cookie会暴露username等个人信息，很危险
- cookie中应存储userid(sid)，server端对应username
- session,即server端存储用户信息
- 如果把session放在js变量中，就相当于放在js的进程内存中，会存在一些问题
- 第一，进程内存有限，访问量过大，内存会暴增
- 第二正式上线是多进程，进程之间内存无法共享

## redis（内存数据库）

- web server 最常用的缓存数据库，数据存放在**内存**中
- 相比mysql，访问速度更快
- 但是成本更高，可存储的数据量更小 
- 将web sever 和redis拆分为两个单独的服务
- 双方都是独立的，都是可扩展的（例如都扩展成集群）
- 可以解决session在nodejs中的问题

## session在redis中的好处

- session访问频繁，对性能要求极高
- session可不考虑断电丢失数据的问题
- session数据量不会太大
- redis操作：
  - set  key   value //设置键值
  - get key //获取某个值
  - keys * //获取所有值
  - del key  // 删除键值

## 为何网站数据不放在redis中

* 操作频率不太高（相对于session）

* 断电不能丢失，必须保留

* 数据量太大，内存成本太高 

  


## nodejs 连接redis

* 启动redis服务

  ```
  redis-server.exe
  ```

* 连接redis

  * 新建一个命令行窗口

  * ```
    redis-cli
    ```

    

- npm 安装，redis模块
- 创建客户端
- set，get操作客户端
- 错误处理
- 退出

## nginx
- 高性能的web服务器
- 一般用做静态服务，负载均衡
- 反向代理

![1585818800557](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\1585818800557.png)

- nginx的简单配置
- nginx的常用命令
  - start nginx
  - nginx -s stop
  - nginx -s reload

## 日志

* 日志对server端非常重要
* 访问日志 access log （server端最重要的日志）
* 自定义日志（包括自定义事件、错误记录等）
* nodejs文件操作 ，nodejs stream
* 日志功能开发和使用
* 日志拆分，日志内容分析 
* 日志要存储到文件中

## nodejs操作文件

* 先引入fs和path模块，分别对应文件操作和路径
* **fs.readFile()** //接受两个参数，第一是文件名，第二个是回调函数
* **fs.writeFile()** //接受的第一个参数是文件名，第二个是写入的内容，第三个是写入的方法，第四个是回调函数
* **fs.exists()** //第一个参数是文件名，第二个参数是回调函数
* 以上的直接读写方法都存在如果内容过大，内存，性能占用太大的问题
* 即IO操作的性能瓶颈，**IO**包括"网络IO" 和"文件IO"
* 相比于CPU计算和内存读写，IO的突出的特点就是**慢**

## stream（流）

* stream的优势

  * 每次传输数据通过流的形势少量传输，不会占用太多的内存和性能

* 引入fs和path模块

* **const readStream = fs.createReadStream(filename)** //创建读入流

* **const writeStream = fs.createWriteStream(filename2)** //创建写入流

* **readStream.pipe(writeStream) //通过pipe 连接**

* **readline** 

  * 可以实现**逐行读取**
  * 可以完成**日志分析**的某些功能(比如分析chrome在访问浏览器中的占比)


## 安全问题

* **sql注入**

  * 攻击方式：输入一个SQL片段，最终拼接成一段攻击代码
    * example: 输入用户名时 输入： **name' --**  //相当于查询数据库时直接注释后面的内容，导致数据库暴露
  * 预防措施：使用mysql的escape函数处理输入内容 **name=mysql.escape（name）**，作用让输入的内容特殊化，**'**等符号直接转义
  * 一般的输入内容都需要escape处理

* **XSS攻击**

  * 攻击方式：在页面展示内容中掺杂js代码，以获取网页信息（例如cookie的信息）

  * 预防方式：转换生成**js**的特殊字符

  * 例如<script>

  * 安装防xss模块

    * ```
      npm install xss --save
      ```

  * 需要用户输入的 

* **密码加密**

  * 万一数据库被用户攻破，最不应该泄漏的就是用户信息
  * 攻击方式：获取用户名和密码，再去尝试登陆其他系统
  * 预防措施：将密码加密，即便拿到密码也不知道明文
  * 利用nodejs提供的**crypto**库来实现加密算法
  * 数据库也同时需要更新

## 核心知识点

* http，nodejs处理http，路由处理，连接mysql

* cookie，session，redis，nginx反向代理

* sql注入，xss攻击，加密

* 日志，stream，contrab，readline

## express

- express下载和安装
  - 通过express脚手架工具 npm install express-generator -g（安装脚手架工具）
  - 直接 express dir_name 创建express架子
  - npm install 安装相关环境依赖
  - npm start 
- 开发接口，连接数据库，实现登录，日志记录
- 分析express中间件机制

## express处理GET请求和POST请求

1. **处理GET路由**

* 创建get请求 先**引入express和route**r，通过**router.get()**//来创建请求，该方法接受的第一个参数是**子路径**

* ```javascript
  var express = require('express')
  var router = express.Router();
  
  //每定义一个路由都是由一个函数承载
  router.get('/list',function(req,res,next){
      res.json({
          error:0
      })
  });
  module.exports = router
  ```

* 在app.js中引入子路由

* ```js
  var blogRouter = require('./routes/blog');
  ```

* 通过app.user=() 注册路由 //接受的第一个参数是父路由，第二参数是子路由

* ```js
  app.use('/api/user',userRouter);
  ```

2. **处理POST路由**

* 方法大致和GET一致，方法改为router.post()，可以通过**req.body**直接获取**postData**

* ```js
  var express = require('express')
  var router = express.Router();
  
  router.post('/login',(req,res,next)=>{
      const {username,password} = req.body; //可以直接拿到post信息
      res.json({
          error:0,
          data:{
              username,
              password
          }
      })
  })
  
  module.exports = router
  ```

  

## express中间件机制

* app.use() //如果有多个参数,第一个参数是要命中的 ，后面的函数参数是回调函数（可为中间件）
* app.use() //如果只有一个参数，则为中间件的函数
* next()   //将app的每个方法连接起来 使其成为中间件
* api.get()
* api.post()