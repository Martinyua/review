/*
 * @Author: Martin
 * @Date: 2020-11-19 15:06:44
 * @LastEditTime: 2020-11-19 15:13:32
 * @FilePath: \Daily_question\src\deepCopy.js
 */
/**
 * 对于深拷贝，如果遇到属性值为引用对象，则新建一个引用类型并将对应的值赋给他
 * 遇到对象则递归
 */

function deepCopy(object) {
    if (!object || object === 'object') { return }

    let newObject = Array.isArray(object) ? [] : {}

    for (let key in object) {
        if (object.hasOwnProperty(key)) {
            newObject[key] = 
            typeof object[key] === "object" ? deepCopy(object[key]) : object[key]
        }
    }
    return newObject
}