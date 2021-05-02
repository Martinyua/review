/*
 * @Author: Martin
 * @Date: 2021-03-04 20:22:14
 * @LastEditTime: 2021-03-04 20:49:27
 * @FilePath: \undefinedc:\Users\Lenovo\Desktop\Spring recruit review\9.算法\算法相关\1.两数之和.js
 */
/*
 * @lc app=leetcode.cn id=1 lang=javascript
 *
 * [1] 两数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    let map = new Map()
    for(let i = 0;i < nums.length;i++){
        let n = nums[i]
        let n2 = target - n
        if(map.has(n2)){
            return [map.get(n2),i]
        }
        map.set(nums[i],i)
    }
};
// @lc code=end

