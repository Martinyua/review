/*
 * @Author: Martin
 * @Date: 2021-02-13 08:45:14
 * @LastEditTime: 2021-02-13 10:14:17
 * @FilePath: \算法相关\插入排序.js
 */
/**
 * 思路：从第二个数开始往前比，
 * 遇到比它大的数就继续往前比，直到找到比它小的数，就插入到该位置
 * 以此类推进行到最后一个数
 * 时间复杂度：O(n^2)
 * 空间复杂度：O(1)
 */

Array.prototype.insertionSort = function () {
    for (let i = 1; i < this.length; i++) {
        const temp = this[i];
        let j = i;
        while (j > 0) {
            if (this[j - 1] > temp) {
                this[j] = this[j - 1] //比它大就继续往前比
            } else {
                break //找到比它小的就停止
            }
            j -= 1;
        }
        this[j] = temp //这个时候的j就是该插入的temp
    }
    return this
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