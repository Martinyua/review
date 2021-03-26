```js
Function.prototype.myCall = function (obj = window) {
  obj.fn = this
  const args = [...arguments].splice(1)
  const result = obj.fn(...args)
  delete obj.fn
  return result
}

Function.prototype.myApply = function (obj = window) {
  obj.fn = this
  const args = arguments[1]
  let result = args ? obj.fn(...args) : obj.fn()
  delete obj.fn
  return result
}

Function.prototype.myBind = function (obj = window) {
  const that = this
  const args = [...arguments].splice(1)
  return function () {
    return that.apply(obj, [...args, ...arguments])
  }
}

// 然后使用即可
function log() {
  console.log(this)
  console.log(this.value)
  console.log(arguments)
}

const obj = {
  value: 123
}

log.myCall(obj, 1, 2, 3)
log.myApply(obj, [1, 2, 3])
log.myApply(obj)
log.myBind(obj)()
log.myBind(obj)(1, 2, 3)
log.myBind(obj, 4, 5, 6)(1, 2, 3)

```

