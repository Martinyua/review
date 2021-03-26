/**
 * instanceof
 */
function myInstanceOf(left, right){
    if(typeof left == null || typeof left !== 'object') return false
    let proto = Object.getPrototypeOf(left)
    while(proto){
        if(proto === right.prototype) return true
        proto = Object.getPrototypeOf(proto)
    }
    return false
}

/**
 * 判断是否是类数组
 */
function isArrayLike(obj){
    if(obj == null || typeof obj !== 'object') return false;
    let len = !!obj && 'length' in obj && obj.length
    return Array.isArray(obj) || len == 0 || len>0 && typeof len === 'number' && length-1 in obj
}

/**
 * 是否是普通对象
 */
function isPlainObj(obj){
    if(!obj || typeof obj !== 'object') return false;
    let proto = obj
    while(proto){
        proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(obj) == proto
}

/**
 * 判断是否为空对象
 */
function isEmpty(obj){
    for(let key in obj){
        return false 
    }
    return true;
}

/**
 * 手写call
 */
Function.prototype.call = function(context, ...args){
    context = context || window
    let fn = Symbol()
    context[fn] = this;
    let res = context[fn](...args);
    delete(context[fn])
    return res;
}

/**
 * 手写Object.is
 */
function is(x, y){
    if(x===y){
        return x!==0 || y!==0 || 1/x===1/y
    } else {
        return x!==x && y!==y
    }
}

/**
 * 手写apply
 */
Function.prototype.apply = function(context, arr){
    context = context || window
    let fn = Symbol()
    context[fn] = this
    let res;
    if(!arr) res = context[fn]()
    else res = context[fn](...arr)
    delete context[fn]
    return res;
}

/**
 * 手写bind
 */
Function.prototype.bind = function(context, ...args1){
    let self = this;
    let fBound = function(...args2){
        return self.apply(this instanceof self ? this : context, [...args1, ...args2])
    }
    fBound.prototype = Object.create(self.prototype)
    return fBound
}

/**
 * 手写new
 */
function Factory(){
    let ctor = [].shift.call(arguments)
    let obj = Object.create(ctor.prototype)
    let res = ctor.apply(obj, arguments)
    return typeof res == 'object' ? res : obj
}

/**
 * 类数组转为数组
 */
[...arr]
Array.from(arguments)
Array.prototype.splice.call(arguments)
Array.prototype.concat.apply([],arguments)

/**
 * 继承
 */
function Super(){
    this.name = 'ky';
}
Super.prototype.sayName = function(){
    console.log(this.name)
}

function Sub(){
    Super.call(this)
}

Sub.prototype = new Super()
Sub.prototype.constructor = Sub

function create(obj){
    function func() {}
    fucn.prototype = obj
    return new func();
} //引用类型的属性值始终会被共享

/**
 * 数组扁平化
 */
var arr = [1,2,[3,4]]
arr.flat(Infinity)

let res =[]
function flatten(arr) {
    for(let i=0; i<arr.length; i++){
        if(Array.isArray(arr[i])){
            flatten(arr[i])
        } else {
            res.push(arr[i])
        }
    }
}

function flatten2(arr){
    return arr.reduce((prev, next)=>{
        return prev.concat(Array.isArray(next)?flatten2(next):next)
    }, [])
}

function flatten3(arr){
    while(arr.some(item=>Array.isArray(item))){
        arr = [].concat([...arr])
    }
    return arr;
}

/**
 * 浅拷贝
 */
function shollowCopy(obj){
    let res = {}
    for(let key in obj){
        if(Object.hasOwnProperty(key)) res[key] = obj[key]
    }
    return res;
}

/**
 * 深拷贝
 */
function deepCopy(obj, parent){
    let res;

    let _parent = parent
    while(_parent){
        if(_parent.originalParent == obj){
            return _parent.currentParent
        }
        _parent = _parent.parent
    }

    if(obj && typeof obj === 'object'){
        if(obj instanceof RegExp){
            return new RegExp(obj.source, obj.flags)
        } else if( obj instanceof Date){
            return new Date(obj.getTime())
        } else {
            if(obj instanceof Array){
                res = []
            } else{
                res = Object.create(Object.getPrototypeOf(obj))
            }
            for(let key in obj){
                if(Object.hasOwnProperty(key)){
                    if(obj[key] && typeof obj[key] == 'object'){
                        res[key] = deepCopy(obj[key],{
                            originalParent: obj,
                            currentParent : res,
                            parent: parent
                        })
                    } else {
                        res[key] = obj[key]
                    }
                }
            }
        }
    } else {
        return obj
    }
    return res;
}

/**
 * 防抖
 */
function debounce(func, wait){
    let timeout;
    return function(){
        let context = this;
        let args = arguments;
        if(timeout) clearTimeout(timeout)
        timeout = setTimeout(()=>{
            func.apply(context, args)
        }, wait)
    }
}

/**
 * 节流
 */
function throttle(func, wait){
    let prev = 0;
    return function(){
        let context = this;
        let args = arguments;
        let now = +new Date()
        if(now - prev > wait){
            prev = now;
            func.apply(context, args)
        }
    }
}

function throttle2(func, wait){
    let timeout;
    return function(){
        let context = this;
        let args = arguments;
        if(!timeout){
            timeout = setTimeout(()=>{
                timeout = null
                func.apply(context, args)
            }, wait)
        }
    }
}

/**
 * 判断两个对象是否相等
 */
function eq(a,b,aStack,bStack){
    if(a===b){
        return a!==0 ||b!==0||1/a===1/b
    } else {
        if((typeof a==='object' && typeof a !== null) && (typeof b ==='object' && typeof b !== null)){
            
            aStack = aStack || [], bStack = bStack || []
            let len = aStack.length
            while(len--){
                if(aStack[len] === a) return bStack[len] === b
            }

            aStack.push(a)
            bStack.push(b)

            if(Object.keys(a).length !== Object.keys(b).length) return false
            for(let key in a){
                if(b.hasOwnProperty(key)){
                    if(!eq(a[key], b[key],aStack,bStack)){
                        return false
                    }
                } else {
                    return false
                }
            }

            aStack.pop()
            bStack.pop()

            return true;
        }else{
            if(a!==a) return b!==b
            return true
        }
    }
}

/**
 * 数组去重
 */
Array.from(new Set(arr))

function unique(arr){
    let map = new Map()
    for(let i=0; i<arr.length; i++){
        if(map.has(arr[i])){
            arr.splice(i, 1)
            i--
        }else{
            map.set(arr[i], true)
        }
    }
    return arr
}

function unique2(arr){
    let res = []
    for(let i=0; i<arr.length; i++){
        if(res.indexOf(arr[i])===-1) res.push(arr[i])
    }
    return res;
}

/**
 * 柯里化
 */
function curry(func, ...args){
    let length = func.length;
    if(args.length >= length) return func(...args)
    return function(...args2){
        return curry(func, ...args, ...args2)
    }
}


/**
 * 函数组合
 */
function compose(...funcs){
    if(funcs.length === 0) return args=>args;
    if(funcs.length === 1) return funcs[0];
    return funcs.reduce((a,b)=>(...args)=>a(b(...args)))
}

/**
 * 乱序
 */
arr.sort(()=>Math.random()-0.5)
function shuffle(a){
    for(let i=a.length; i>0; i--){
        let j = Math.floor(Math.random()*i)
        [a[i-1],a[j]] = [a[j],a[i-1]]
    }
}

/**
 * XHR
 */
var xhr = new XMLHttpRequest()
xhr.open('get', 'example', true)
xhr.send(null)
xhr.onreadystatechange = function(){
    if(xhr.readyState === 4){
        if((xhr.status >=200 && xhr.status < 300) || xhr.status === 304){
            alert(xhr.responseText)
        } else {
            alert(xhr.status)
        }
    }
}

/**
 * fetch
 */
fetch('http://127.0.0.1',{
    method: 'POST',
    headers: {
        name: 'ky'
    },
    body: 'name=ky&password=root'
})

/**
 * 实现一个 map
 */
Array.prototype.map2 = function(fn, context){
    let arr = Object(this);
    let res = []
    for(let i=0; i<arr.length; i++){
        if(i in arr){
            res.push(fn.call(context, arr[i], i, arr))
        }
    }
    return res;
}

/**
 * 实现一个 filter
 */
Array.prototype.filter2 = function(fn, context){
    let arr = Object(this)
    let res = []
    for(let i=0; i<arr.length; i++){
        if(i in arr){
            if(fn.call(context, arr[i], i, arr)){
                res.push(arr[i])
            }
        }
    }
    return res;
}

/**
 * 实现一个 reduce
 */
Array.prototype.reduce = function(fn, init){
    let arr = Object(this)
    let len = arr.length >>> 0
    let prev = init;
    let k=0
    if(prev === undefined){
        for(;k<len; k++){
            if(k in arr){
                prev = arr[k]
                k++
                break;
            }
        }
    }
    if(k == len || prev == undefined) throw new Error('empty')
    for(; k<len; k++){
        if(k in arr){
            prev = fn.call(undefined, prev, arr[k], k, arr)
        }
    }
    return prev;
}


/**
 * promisify
 */
function promisify(fn, ...args){
    return new Promise((resolve, reject)=>{
        fn(...args, (err,data)=>{
            if(err) reject(err)
            else resolve(data)
        })
    })
}

/**
 * Promise.all
 */
Promise.all = function(promises){
    return new Promise((resolve, reject)=>{
        let res = []
        let len = promises.length
        if(len === 0){
            resolve(res)
            return
        }
        let index = 0;
        for(let i=0; i<promises.length; i++){
            Promise.resolve(promises[i]).then((data)=>{
                res[index++] = data;
                if(index === len) return res;
            }).catch((e)=>{
                reject(e)
            })
        }
    })
}

/**
 * Promise.allSettled
 */
Promise.allSettled = function(promises){
    return new Promise((resolve, reject)=>{
        let len = promises.length;
        let index = 0
        let res = []
        if(len === 0) {
            resolve(res)
            return
        }
        for(let i=0; i<len; i++){
            Promise.resolve(promises[i]).then((data)=>{
                res[index++] = {
                    status: 'fulfilled',
                    value: data
                }
                if(len === index) resolve(res);
            }).catch((e)=>{
                res[index++] = {
                    status: 'rejected',
                    value: e
                }
                if(len === index) resolve(res);
            })
        }
    })
}

/**
 * Promise.race
 */
Promise.race = function(promises){
    return new Promise((resolve, reject)=>{
        let len = promises.length;
        if(len ===0 ){
            resolve(res)
            return
        }
        for(let i=0; i<len; i++){
            Promise.resolve(promises[i]).then((data)=>{
                resolve(data)
                return 
            }).catch((e)=>{
                reject(e)
                return
            }
            )
        }
    })
}

/**
 * finnaly
 */
Promise.prototype.finnaly = function(func){
    this.then(value=>{
        return Promise.resolve(func()).then(()=>value)
    }, err=>{
        return Promise.resolve(func()).catch(()=>{throw err})
    })
}

/**
 * Promise.resolve
 */
Promise.resolve = function(param){
    if(param instanceof Promise) return param
    return new Promise((resolve, reject)=>{
        if(param && param.then && typeof param.then === 'function'){
            return param.then(resolve, reject)
        }else{
            resolve(param)
        }
    })
}

/**
 * 并发控制器
 */
//不会写，蒲宇教教我！！！

/**
 * 插入排序
 */
function InsertSort(arr){
    for(let i=1; i<arr.length; i++){
        for(let j=i; j>0 && a[j]<a[j-1]; j--){
            [a[j], a[j-1]] = [a[j-1],a[j]]
        }
    }
    return arr
}


/**
 * 快排
 */
function QuickSort(arr){
    let partition = (arr, left, right)=>{
        let privot = arr[Math.floor(Math.random()*(right-left)+left)]
        while(left < right){
            while(arr[right] > privot) right--
            while(arr[left] < privot) left++
            [arr[left], arr[right]] = [arr[right], arr[left]]
            if(arr[left] == arr[right] && left !== right) left++
        }
    }   
    
    let sort = (arr, left ,right)=>{
        if(left < right){
            let index = partition(arr, left, right)
            sort(arr, left, index-1)
            sort(arr, index+1, right)
        }
    }

    sort(arr, 0, arr.length-1)
}

/**
 * 冒泡排序
 */
function BubbleSort(arr){
    for(let i=0; i<arr.length-1; i++){
        for(let j=0; j<arr.length-i-1; j++){
            if(arr[j] > arr[j+1]){
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]]
            }
        }
    }
    return arr
}

/**
 * 发布订阅
 */
function EventBus(){
    this.map = {}
}
EventBus.prototype.on = function(type, func){
    if(!this.map[type]){
        this.map[type] = []
    }
    this.map[type].push(func)
}
EventBus.prototype.emit = function(type, ...args){
    if(this.map[type]){
        this.map[type].forEach((item)=>{
            item(...args)
        })
    }
}
EventBus.prototype.off = function(type, func){
    if(this.map[type]){
        let index = this.map[type].indexOf(func)
        if(index !== -1) this.map[type].splice(index, 1)
    }
}
EventBus.prototype.once = function(type, func){
    const wrapper = (...args)=>{
        func(args)
        this.off(type, wrapper)
    }
    this.on(type, wrapper)
}

/**
 * 单例模式
 */
class SingleDog{
    static getInstance(){
        if(!SingleDog.instance){
            SingleDog.instance = new SingleDog()
        }
        return SingleDog.instance
    }
}