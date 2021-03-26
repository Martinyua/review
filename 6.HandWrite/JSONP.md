<!--
 * @Author: Martin
 * @Date: 2021-03-02 19:00:46
 * @LastEditTime: 2021-03-22 10:54:41
 * @FilePath: \6.HandWrite\JSONP.md
-->
```js
const script = document.createElement('script')
script.type = 'text/javascript'

script.src = 'xxx.com/login?user=xxx&password=123&callback=onBack'
document.head.appendChild(script)

function onBack(res) {
    console.log(res)
}

//server
onBack(data)
```

