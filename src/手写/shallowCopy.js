/*
 * @Author: Martin
 * @Date: 2020-11-19 14:55:10
 * @LastEditTime: 2020-11-19 15:04:36
 * @FilePath: \Daily_question\src\shallowCopy.js
 */
/**
 * 浅拷贝指的是将一个对象的属性值复制到另一个对象，如果有的属性为引用类型的话，那么将这个引用的地址复制给对象，
 * 浅拷贝还可以使用Object.assign和展开运算符来实现
 */

function shallowCopy(object) {
    //只拷贝对象
    if (!object || typeof object !== "object") return

    //判断新建的object是对象还是数组
    let newObject = Array.isArray(object) ? [] : {}

    for (let key in object) {
        if(object.hasOwnProperty(key)){
             newObject[key] = object[key];
        }
    }
    return newObject
}                                                    