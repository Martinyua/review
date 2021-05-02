/*
 * @Author: Martin
 * @Date: 2021-03-04 20:12:17
 * @LastEditTime: 2021-03-04 20:18:46
 * @FilePath: \undefinedc:\Users\Lenovo\Desktop\Spring recruit review\9.算法\算法相关\3.无重复字符的最长子串.js
 */
/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let l = 0
    let map = new Map()
    let res = 0
    for ( let i = 0;i < s.length;i++){
        if(map.has(s[i]) && map.get(s[i]) >= l){
            l = map.get(s[i]) + 1
        }
        res = Math.max(res,i -l + 1)
        map.set(s[i],i)
    }
    return res
};
// @lc code=end

