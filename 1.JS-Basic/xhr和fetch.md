### 原生`xhr`

* 现代浏览器，最开始与服务端交换数据都是通过`XMLHttpRequest`进行数据交互的

* 他同时也有一些缺点。

  * 使用起来比较繁琐
  * XHR 基于事件机制实现请求成功与失败的回调

* 一个简单的xhr

  ```
  xhr = new XMLHttpRequest();
  xhr.open('GET',  'data.txt',  true);
  xhr.sendc();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4){
      if(xhr.status == 200){
        success(xhr.responseText);
      } else {
        if(failed){
           failed(xhr.status);
        }
      }
    }
  }
  
  ```

* XHR 的事件监听

  * progress 处理中
  * abort 取消，XHR.abort() 函数调用时触发该事件
  * error 错误
  * load 完成加载
  * timeout 事件超时

### Fetch

Fetch API提供了一个 `JavaScript` 接口，用于访问和操作HTTP管道的部分，例如请求和响应。Fetch更加底层，基于Promise实现回调更加友好

* 使用案例

  ```
  fetch(url, {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  ```

* 注意点与区别

  * 语法简介，更加啊语义化。脱离了xhr
  * 默认不会带**cookie**，需要添加配置项：fetch(url,{credentials:‘include’})
  * 支持网络请求报错，**也就是说只有网络错误这些导致请求不能完成时他才会调用reject**，而对400，500这种错误它并不会reject。当接收到一个代表错误的 HTTP 状态码时，从 fetch()返回的 Promise 不会被标记为 reject， 即使该 HTTP 响应的状态码是 404 或 500。相反，它会将 Promise 状态标记为 resolve （但是会将 resolve的返回值的 ok 属性设置为 false ），仅当**网络故障时或请求被阻止时**，才会标记为 reject。
  * **不支持abort**
  * **不能**检测原生事情**请求进度**



### Axios

## 3. axios

`Axios`是一个基于`promise`的`HTTP`库，可以用在浏览器和 `node.js` 中。它本质也是对原生`XMLHttpRequest`的封装，只不过它是Promise的实现版本，符合最新的ES规范。

```
axios({
    method: 'post',
    url: '/user/12345',
    data: {
      firstName: 'liu',
      lastName: 'weiqin'
    }
  })
  .then(res => console.log(res))
  .catch(err => console.log(err))
```