/*
 * @Author: Martin
 * @Date: 2021-02-13 08:45:14
 * @LastEditTime: 2021-03-23 09:46:54
 * @FilePath: \算法相关\插入排序.js
 */
/**
 * 思路：默认 a[0] 为已排序数组中的元素，从 arr[1] 开始逐渐往已排序数组中插入元素，从后往前一个个比较，
 * 如果待插入元素小于已排序元素，则已排序元素往后移动一位，直到待插入元素找到合适的位置并插入已排序数组。
 * 时间复杂度：O(n^2)
 * 空间复杂度：O(1)
 */

 function insertionSort(arr) {
    for (let i = 1, len = arr.length; i < len; i++) {
      const temp = arr[i];
      let preIndex = i - 1;
  
      while (arr[preIndex] > temp) {
        arr[preIndex + 1] = arr[preIndex];
        preIndex -= 1;
      }
      arr[preIndex + 1] = temp;
    }
  
    return arr;
  }
  
Array.prototype.insertionSort = function () {
    for (let i = 1; i < this.length; i++) {
        let temp = this[i]
        let j = i
        while (j > 0) {
            if (this[j - 1] > temp) {
                this[j] = this[j - 1]
            } else {
                break
            }
            j--
        }
        this[j] = temp
    }
    return this
}