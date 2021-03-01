/*
 * @Author: Martin
 * @Date: 2020-10-18 21:09:57
 * @LastEditTime: 2020-10-20 21:52:27
 * @FilePath: \Daily_question\src\算法相关\leetcode_53.js
 */
/**
 * 最大子序和
 * 动态规划解法:该题的切入点是对于序列中的每一个值都需要一个抉择，即当前值是否要和前一个序列合并或者保留自己，
 * 显然要当前一个序列和大于0时，就合并，即f(i)=max{f(i−1)+ai,ai}。对于每一个元素都需要考虑以上。
 */
var maxSubArray = function (nums) {
    let maxSum = nums[0]
    let dp = new Array(nums.length)
    dp[0] = nums[0]
    for (let i = 0; i < nums.length; i++) {
        dp[i] = Math.max(dp[i - 1], 0) + nums[i]
        maxSum = Math.max(maxSum, dp[i])
    }
    return maxSum
};