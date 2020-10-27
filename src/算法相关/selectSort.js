/*
 * @Author: Martin
 * @Date: 2020-10-27 23:02:33
 * @LastEditTime: 2020-10-27 23:10:52
 * @FilePath: \Daily_question\src\算法相关\selectSort.js
 */
/**
 * 选择排序
 * 找到数组中的最小值，选中它并且将它放到第一位
 * 找到第二小值，选中它并且将它放到第二位
 * 依次类推执行n-1轮
 */
Array.prototype.selectSort = function () {
    for (let i = 0; i < this.length - 1; i++) {
        let indexMin = i
        for (let j = i; j < this.length; j++) {
            if (this[j] < this[indexMin]) {
                indexMin = j
            }
        }

        if (indexMin != i) {
            const temp = this[i]
            this[i] = this[indexMin]
            this[indexMin] = temp
        }
    }
}