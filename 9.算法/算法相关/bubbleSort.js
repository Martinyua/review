/*
 * @Author: Martin
 * @Date: 2020-10-27 22:55:12
 * @LastEditTime: 2021-02-13 08:40:55
 * @FilePath: \算法相关\bubbleSort.js
 */

/**
 * 冒泡算法：
 * 比较所有相邻元素，如果第一个比第二个大，则交换他们。
 * 一轮下来，可以保证最后一个数是最大的
 * 执行n-1轮，就可以完成排序，第二轮的循环会随着第一轮的执行而减少
 * 时间复杂度：O(n^2)，空间复杂度:O(1)
 * 写时可以联想第一个是最大的情况来写
 */

Array.prototype.bubble = function () {
    for (let i = 0; i < this.length - 1; i++) {
        for (let j = 0; j < this.length - 1 - i; j++) {
            if (this[j] > this[j + 1]) {
                let temp = this[j + 1]
                this[j + 1] = this[j]
                this[j] = temp
            }
        }
    }
}




Array.prototype.bubble = function () {
    for (let i = 0; i < i.length - 1; i++) {
        for (let j = 0; j < this.length - 1 - i; j++) {
            if (this[j] > this[j + 1]) {
                const temp = this[j]
                this[j] = this[j + 1]
                this[j + 1] = temp
            }
        }
    }
    return this
}
