/*
 * @Author: Martin
 * @Date: 2021-02-01 22:03:34
 * @LastEditTime: 2021-03-23 09:16:27
 * @FilePath: \算法相关\选择排序.js
 * 找到数组中最小的值，将其放在第一位，找到数组中第二小的值，将其放在第二位，以此类推执行n - 1轮
 * 时间复杂度： O(n^2)
 * 思路：找到每次遍历中最小的放在第i位。和冒泡不同的是要找到最小的才交换，而不是找到了小的就交换
 */
                                                                        
Array.prototype.selectionSort = function () {
    for (let i = 0; i < this.length; i++) {
        let indexMin = i
        for (let j = i; j < this.length; j++) {
            if (this[j] < this[indexMin]) {
                indexMin = j
            }
            let temp = this[i]
            this[i] = this[indexMin]
            this[indexMin] = temp
        }
    }
    return this
}

function selectSort(arr) {
    let len = arr.length;
    let minIndex
    
    for(let i = 0; i < len - 1; i++) {
      minIndex = i;
      for(let j = i + 1; j < len; j++) {
        if(arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      } //找到最小
      [arr[i],arr[minIndex]] = [arr[minIndex],arr[i]]
    }
    return arr;
  }



//节流
function throttle(fn, delay = 100) {
    let timer = null
    return function () {
        if (timer) {
            return
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments)
            timer = null
        }, delay)
    }

}

//防抖
function debounce(fn, delay = 500) {
    let timer = null
    return function () {
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(() =>{
            fn.apply(this,arguments)
            timer = null
        },delay)
    }
}
