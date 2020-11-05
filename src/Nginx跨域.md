# 一次Nginx跨域实践

> 6.20日配置nginx跨域踩的坑记录

* 在开发静态页面时，类似React的应用，我们常会调用一些接口，这些接口极可能是跨域，然后浏览器就会报cross-origin问题不给调。如果后端没有设置CORS跨域的话，前端可以通过nginx来实现跨域

* 这次配置这个项目，原本后端设置了跨域，如果nginx也设置跨域的话同样会报错。多次跨域的报错。![1592659714091](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\1592659714091.png)

  原本以为是可以直接取消掉nginx的跨域设置的。但是由于这个服务器是别人的服务器，不能去取消掉别人的全局跨域

* nginx跨域 ，网上的教程大多数都是这样![1592660166043](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\1592660166043.png)

  这样确实可以实现跨域，不过是在nginx端的，也就是中间层可以，浏览器是不允许的

  ## 解决方案

  * 所以这个时候只能用nginx来做代理

  * 使用Nginx转发请求。把跨域的接口写成调本域的接口，然后将这些接口转发到真正的请求地址。

  * 大致的思路是前端请求的api和域名要是同一个。这样浏览器才能请求。所以前端的域名如果是 test.com 那么 可以将请求的api设置为 test.com/api 。这样浏览器就可以实现同源。

  * nginx的配置思路是 当 location 碰到 /api ，就代理到另一个端口去。

    * 我的配置如下

    ```nginx
    	server {
            listen       80;
            server_name  vxrungroupmanage.cqsports.org;
            charset utf-8,gbk;
    		root    /root/wxbuild;
    		index index.html;
            location /api {
                proxy_pass http://vxrungroup.cqsports.org/;
            }
    		
        }
    ```

    其实看起来还是挺简单的，但是其中的原理却很多。对于一个nginx小白来说还是有点不好理解。

    监听80端口，后台api和前端url都是同一个。当域名路由为/api就代理到另一个服务来处理。注意代理的域名后面还有**/**,具体为什么，后面再来研究

  * 还有这些原理 nginx还是有点东西

  ## 参考

  [如何用Nginx解决前端跨域问题](https://www.cnblogs.com/lovesong/p/10269793.html)

  [nginx完美解决跨域问题](<https://blog.csdn.net/zanpengfei/article/details/86605837?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.nonecase>)

  