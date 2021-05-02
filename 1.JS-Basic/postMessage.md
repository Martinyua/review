> 虽然是冷门知识点，面试很常考，比如如何跨标签进行通信，跨域获取localStorage



### 发送数据

向其他窗口发送数据

`otherWindow.postMessage(message,targetOrigin,[transfer])`

* `otherWindow` 窗口的一个引用，比如`iframe`的`contentWindow`属性，执行window.open()返回的窗口对象
* `message` 。要传输的数据，他将会被(结构化克隆)序列化。可以不受限制的将数据安全的传输给目标窗口
* `targetOrigin`指定哪些窗口能接受到消息，指定后只有对应的origin窗口能接受到消息。`'*'`表示可以发送到任何窗口。处于安全考虑不要这么做。如果要发送到与当前窗口同源的话，就设置 `"/"`

### 接受数据

**监听message事件的发生**

```
window.addEventListener("message", receiveMessage, false) ;
function receiveMessage(event) {
     var origin= event.origin;
     console.log(event);
}
```

event有四个重要的属性:

* data:发送过来的消息
* type:发送消息的类型
* source:发送消息的窗口对象 (比如global)
* origin:指的是发送消息的窗口的源

### 通过`postMessage` + `iframe` 实现跨域

通过子窗口代理代理父窗口的请求来跨域

父窗体创建跨域`iframe`并且发送消息

* 首先获取`iframe`对象
* 然后`iframe.contentWindow`(对象)
* 通过这个对象的`postMessage`方法发送消息
* `window.addEventListener("message",function(event){},false)`//监听返回

子窗口来发送消息

*  `window.parent.postMessage(res, "*");`    向父窗口发送消息
* 监听同样是`window.addEventListener("message",function(event){},false)`





ex：

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>跨域POST消息发送</title>
        <script type="text/JavaScript">    
            // sendPost 通过postMessage实现跨域通信将表单信息发送到 moweide.gitcafe.io上,
            // 并取得返回的数据    
            function sendPost() {        
                // 获取id为otherPage的iframe窗口对象        
                var iframeWin = document.getElementById("otherPage").contentWindow;        
                // 向该窗口发送消息        
                iframeWin.postMessage(document.getElementById("message").value, 
                    'http://moweide.gitcafe.io');    
            }    
            // 监听跨域请求的返回    
            window.addEventListener("message", function(event) {        
                console.log(event, event.data);    
            }, false);
        </script>
    </head>
    <body> 
        <textarea id="message"></textarea> 
        <input type="button" value="发送" onclick="sendPost()"> 
        <iframe
            src="http://moweide.gitcafe.io/other-domain.html" id="otherPage"
            style="display:none"></iframe>
    </body>

</html>
```

```
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>POST Handler</title>
        <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
        <script type="text/JavaScript">
            window.addEventListener("message", function( event ) {
                // 监听父窗口发送过来的数据向服务器发送post请求
                var data = event.data;
                $.ajax({
                    // 注意这里的url只是一个示例.实际练习的时候你需要自己想办法提供一个后台接口
                    type: 'POST', 
                    url: 'http://moweide.gitcafe.io/getData',
                    data: "info=" + data,
                    dataType: "json"
                }).done(function(res){        
                    //将请求成功返回的数据通过postMessage发送给父窗口        
                    window.parent.postMessage(res, "*");    
                }).fail(function(res){        
                    //将请求失败返回的数据通过postMessage发送给父窗口        
                    window.parent.postMessage(res, "*");    
                });
            }, false);
        </script>
    </head>

    <body></body>
</html>
```

