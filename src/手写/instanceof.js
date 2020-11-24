/*
 * @Author: Martin
 * @Date: 2020-11-23 09:48:39
 * @LastEditTime: 2020-11-23 10:08:22
 * @FilePath: \Daily_question\src\instanceof.js
 */
function myInstaceof(left, right) {
    if (typeof left !== 'object' || left === null) return false
    //getPrototypeOf可以拿到对象的原型对象
    let proto = Object.getPrototypeOf(left)


    while (true) {
        //查找至原型链尽头，如果为null则没有查找到
        if (proto === null) return false
        //查找到了则返回true
        if (proto === right.prototype) return true
        //没有找到则一直向上查找
        proto = Object.getPrototypeOf(proto)
    }
}
