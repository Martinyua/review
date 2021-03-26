/*
 * @Author: Martin
 * @Date: 2021-02-01 18:18:15
 * @LastEditTime: 2021-03-22 10:27:22
 * @FilePath: \undefinedc:\Users\Lenovo\Desktop\Spring recruit review\6.HandWrite\flatten.js
 */
//forEach
let res = []
const flatten = (arr) => {
    arr.forEach((item, i, arr) => {
        if (Array.isArray(item)) {
            flatten(item)
        } else {
            res.push(item)
        }
    })
}

//for
let res = []
const flatten = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (Array.isArray(item)) {
            flatten(item)
        } else {
            res.push(item)
        }
    }
}

//利用reduce迭代
function flatten(arr) {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
    }, [])
}

//...拓展运算符

function flatten(arr) {
    while (arr.some(item => Array.isArray(item))) {
        arr = [].concat(...arr)
    }
    return arr
}

let res = []
const flatten = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (Array.isArray(item)) {
            flatten(item)
        } else {
            res.push(item)
        }
    }
}

let flatten = (arr) => {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flatten(cur) : cur)
    }, [])
}

let flatten = (arr) => {
    return arr.reduce((pre, cur) => {
        return pre.concat(Array.isArray(pre) ? flatten(cur) : cur)
    }, [])
}
let res = []
let flatten = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (Array.isArray(item)) {
            flatten(item)
        } else {
            res.push(item)
        }
    }
}

let flatten = (arr) => {
    return arr.reduce((pre,cur) => {
        return pre.concat( Array.isArray(cur) ? flatten(cur) : cur)
    },[])
}