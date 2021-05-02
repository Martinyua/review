/*
 * @Author: Martin
 * @Date: 2021-02-19 21:17:18
 * @LastEditTime: 2021-03-22 16:06:32
 * @FilePath: \undefinedc:\Users\Lenovo\Desktop\Spring recruit review\9.算法\算法相关\快速排序.js
 */
/**
 * 思路：1.分区，从数组中任意选择一个"基准"，所有比基准小的放在基准前面，比基准大的元素放在基准的后面
 * 2.递归的对基准前后的子数组进行分区
 */
 const rec = (arr) => {
    if(arr.length <= 1 ) return arr
    let left = []
    let right = []
    let mid = arr[0]
    for (let i = 1; i < arr.length; i++) {

        if(arr[i] < mid){
            left.push(arr[i])
        }else{
            right.push(arr[i])
        }
    }
    return [...rec(left),mid,...rec(right)]
}
let a = rec([1,3,2])
console.log(a)