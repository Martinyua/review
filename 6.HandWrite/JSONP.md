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

