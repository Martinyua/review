/*
 * @Author: Martin
 * @Date: 2021-03-23 15:36:21
 * @LastEditTime: 2021-03-23 16:12:02
 * @FilePath: \Spring recruit review\9.算法\排序\快速排序.js
 */
function quickSort(arr) {
    let partition = (arr, left, right) => {
        let privot = arr[left]
        while(left < right){
            while(arr[left] < privot) left++
            while(arr[right] > privot) right--
            [arr[left],arr[right]] = [arr[right],arr[left]]
            if(arr[left] === arr[right] && left !== right) left++
        }
        return left
    }

    let sort = (arr, left, right) => {
        if (left < right) {
            let index = partition(arr, left, right)
            sort(arr, left, index - 1)
            sort(arr, index + 1, right)
        }

    }
    sort(arr,0,arr.length - 1)
    return arr
}

console.log(quickSort([3,2,3,4,5,1]))

