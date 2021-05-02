```
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class Promise {
  constructor(executor) {
    // 默认状态为 PENDING
    this.status = PENDING;
    // 存放成功状态的值，默认为 undefined
    this.value = undefined;
    // 存放失败状态的值，默认为 undefined
    this.reason = undefined;

    // 调用此方法就是成功
    let resolve = (value) => {
      // 状态为 PENDING 时才可以更新状态，防止 executor 中调用了两次 resovle/reject 方法
      if(this.status ===  PENDING) {
        this.status = FULFILLED;
        this.value = value;
      }
    } 

    // 调用此方法就是失败
    let reject = (reason) => {
      // 状态为 PENDING 时才可以更新状态，防止 executor 中调用了两次 resovle/reject 方法
      if(this.status ===  PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
    }

    try {
      // 立即执行，将 resolve 和 reject 函数传给使用者  
      executor(resolve,reject)
    } catch (error) {
      // 发生异常时执行失败逻辑
      reject(error)
    }
  }

```



### promise .all 

```
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
```



### promise.race

```
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
```

