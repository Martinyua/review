/*
 * @Author: Martin
 * @Date: 2021-02-19 21:17:18
 * @LastEditTime: 2021-03-25 14:14:32
 * @FilePath: \算法相关\快速排序.js
 */
/**
 * 思路：1.分区，从数组中任意选择一个"基准"，所有比基准小的放在基准前面，比基准大的元素放在基准的后面
 * 2.递归的对基准前后的子数组进行分区
 */

// const rec = (arr) => {
//     if (arr.length <= 1) return arr
//     let left = []
//     let right = []
//     let mid = arr[0]
//     for (let i = 1; i < arr.length; i++) {

//         if (arr[i] < mid) {
//             left.push(arr[i])
//         } else {
//             right.push(arr[i])
//         }
//     }
//     return [...rec(left), mid, ...rec(right)]
// }
// let a = rec([1, 3, 2])
// console.log(a)

// Array.prototype.quickSort = function () {
//     const rec = (arr) => {
//         if (arr.length <= 1) return arr
//         const left = []
//         const right = []
//         const mid = arr[0]
//         for (let i = 1; i < arr.length; i++) {
//             if (arr[i] < mid) {
//                 left.push(arr[i])
//             } else {
//                 right.push(arr[i])
//             }
//         }
//         return [...rec(left), mid, ...rec(right)]
//     }
//     const res = rec(this)
//     res.forEach((n, i) => { this[i] = n })
// }

// const arr = [2, 3, 4, 1]
// arr.quickSort()

const quickSort = (arr) => {
    const partition = (arr, left, right) => {
        let privot = arr[left]
        while (left < right) {
            while (arr[left] < privot) left++
            while (arr[right] > privot) right--
            [arr[left], arr[right]] = [arr[right], arr[left]]
            if (arr[left] === arr[right] && left !== right) left++
        }
        return left
    }
    const sort = (arr, left, right) => {
        if(left < right){
            let index = partition(arr, left, right)
            sort(arr, left, index - 1)
            sort(arr, index + 1, right)
        }
    }
    sort(arr, 0, arr.length - 1)
    return arr
}
console.log(quickSort([1,4,2]))