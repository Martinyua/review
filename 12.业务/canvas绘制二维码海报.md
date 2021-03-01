1. 首先定义一个canvas组件

```
  <div class="container">
    <canvas id="canvas" onclick="saveImage()"></canvas>
  </div>
```

2. 获取页面宽度，以及像素比

```
function initParameter() {
  const {
    screen: {
      width
    },
    devicePixelRatio
  } = window
  
  this.windowWidth = width
  this.dpr = Math.round(devicePixelRatio)
}
```

3. 设置一个获取图片base64编码的方法

   1. 首先设置`responseType`为`blob`
   2. 然后创建`fileReader`对象
   3. 定义一个读取成功时触发的回调函数，回调函数可以通过event.target.result拿到文件里的文本
   4. `fileReader.readAsDataURL(blob)`调用读取文件操作

   ```js
   function getURLBase64(url) {
     return new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest()
       xhr.open('get', url, true)
       xhr.responseType = 'blob'
       xhr.onload = function () {
         if (this.status === 200) {
           const blob = this.response
           const fileReader = new FileReader()
           fileReader.onloadend = function (e) {
             const {
               target
             } = e
             const result = target.result
             resolve(result)
           }
           fileReader.readAsDataURL(blob)
         }
       }
       xhr.onerror = function () {
         reject()
       }
           xhr.send()
         })
   
   ```

   