/*
 * @Author: Martin
 * @Date: 2021-04-08 20:37:54
 * @LastEditTime: 2021-04-08 20:49:18
 * @FilePath: \6.HandWrite\手写练习.js
 */
/**
 * 防抖节流
 */
function debounce(fn, delay) {
    let timer;
    return function () {
        if (timer) {
            clearTimeout(timer)
        }
        setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }
}
function throttle(fn, delay) {
    let timer;
    return function () {
        if(timer) {
            return
        }
        setTimeout(() => {
            fn.apply(this,arguments)
            timer = null
        })
    }
}