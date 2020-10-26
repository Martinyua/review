/*
 * @Author: Martin
 * @Date: 2020-10-26 22:54:42
 * @LastEditTime: 2020-10-26 23:11:34
 * @FilePath: \Daily_question\src\算法相关\leetCode_680.js
 */
/**
 * 验证回文串二。验证回文串考虑使用双指针，该题多了一个可以删除一个元素，
 * 对于指针来说就是跳过该元素，并且只有一次机会，所以需要一个辅助函数来完成，跳过后的操作，
 * 跳过后继续使用双指针比较
 * 
 */
var validPalindrome = function (s) {
    let l = 0, r = s.length - 1
    while (l < r) {
        if ([l] != s[r]) {
            return isPli(s,l++,r) || isPli(s,l,r--)
        }
        r++
        l--
    }
};
function isPli(s, l, r) {
    while (l < r) {
        if (s[l] != s[r]) {
            return false
        }
        l++
        r--
    }
    return false
}
