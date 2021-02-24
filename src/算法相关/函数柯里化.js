/*
 * @Author: Martin
 * @Date: 2021-02-15 16:44:53
 * @LastEditTime: 2021-02-15 17:09:39
 * @FilePath: \算法相关\函数柯里化.js
 */
/*
*函数柯里化指的是吧一个接受多个参数的函数转变为一个接受一个参数并且返回处理剩余参数的函数
*最简单的应用就是参数复用，可以提高函数的实用性
*延迟执行。不断的柯里化，累积传入的参数，最后执行
*/



function add() {
    let args = Array.prototype.slice.call(arguments)
    //该函数的作用是接受第二次传入的参数
    let inner = function () {
        args.push(...arguments)
        return inner //递归调用
    }

    //利用隐式转换改写其
    inner.toString = function () {
        return args.reduce((pre, cur) => { 
            return pre + cur
        },0)
    }
    return inner
}