/*
 * @Author: Martin
 * @Date: 2020-10-26 22:54:42
 * @LastEditTime: 2020-10-27 22:52:32
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
        if (s[l] != s[r]) {
            return isPli(s, l + 1, r) || isPli(s, l, r - 1)
        }
        l++
        r--
    }
    return true
};
function isPli(s, l, r) {
    while (l < r) {
        if (s[l] != s[r]) {
            return false
        }
        l++
        r--
    }
    return true
}

// var validPalindrome = function (s) {
//     let l = 0
//     let r = s.length - 1
//     while (l < r) {
//         if (s[r] != s[l]) {
//             return isPli(s, l++, r) || isPli(s, l, r--)
//         }
//     }
//     l++
//     r--
// }
// var isPli = function (s, l, r) {
//     while(l < r){
//         if(s[r] !=s[l]){
//             return false
//         }
//         l--
//         r++
//     }
//     return true
// }