```js
function eventBus() {
    let map = {}
}

eventBus.prototype.on = function (type, func) {
    if (!this.map[type]) {
        map[type] = []
    } else {
        map[type].push(func)
    }
}  
eventBus.prototype.emit = function (type, ...args) {
    if (this.map[type]) {
        this.map[type].forEach((item) => {
            item(...args)
        })
    }
}
eventBus.prototype.off = function (type, func) {
    if (this.map[type]) {
        let index = this.map[type].indexOf(func)
        if(index !== -1) this.map[type].splice(index, 1)
    }
}
eventBus.prototype.once = function (type, func) {
    const warpper = (...args) => {
        func(args)
        this.off(type,warpper)
    }
    this.on(type,warpper)
}
```

