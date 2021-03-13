mdn中：

> 规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否**允许该跨域请求**。

触发预检请求的条件：

​    1、必须要在跨域的情况下。

​    2、除GET、HEAD和POST(only with application/x-www-form-urlencoded, multipart/form-data, text/plain Content-Type)以外的跨域请求（我们可以称为预检(Preflighted)的跨域请求）。



即在跨域的情况下，并且还有以下条件

| CORS预检请求触发条件                                         | 本次请求是否触发该条件 |
| ------------------------------------------------------------ | ---------------------- |
| 1. 使用了下面**任一**HTTP 方法：                             |                        |
| PUT/DELETE/CONNECT/OPTIONS/TRACE/PATCH                       | 否，本次为post请求     |
| 2. 人为设置了**以下集合之外**首部字段：                      |                        |
| Accept/Accept-Language/Content-Language/Content-Type/DPR/Downlink/Save-Data/Viewport-Width/Width | 否，未设置其他头部字段 |
| 3. Content-Type 的值**不属于**下列之一:                      |                        |
| application/x-www-form-urlencoded、multipart/form-data、text/plain | 是，为application/json |

### 总结

OPTIONS请求即**预检请求**，可用于**检测服务器允许的http方法**。当发起跨域请求时，由于安全原因，触发一定条件时浏览器会在正式请求之前**自动**先发起OPTIONS请求，即**CORS预检请求**，**服务器若接受该跨域请求，浏览器才继续发起正式请求**。

