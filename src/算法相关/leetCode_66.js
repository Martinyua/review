/*
 * @Author: Martin
 * @Date: 2020-10-22 22:47:04
 * @LastEditTime: 2020-10-22 22:57:35
 * @FilePath: \Daily_question\src\算法相关\leetCode_66.js
 */
/**
 * 分两种情况，遇到除数字九就进位并且变成零,并且给它的上一位加一，
 * 同样还是会遇到两种情况，所以要使用循环来判断。
 * 不是九则直接加一，并且返回，并且要考虑99等多一个元素的进位
 * 
 */
var plusOne = function (digits) {
    for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] !== 9) {
            digits[i]++;
            return digits;
        } else {
            digits[i] = 0;
        }
    }
    const result = [1, ...digits]
    return result
};