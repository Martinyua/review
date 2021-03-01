/*
 * @Author: Martin
 * @Date: 2020-10-15 22:35:03
 * @LastEditTime: 2020-10-15 23:08:41
 * @FilePath: \Daily_question\src\算法相关\LeetCode_122.js
 */
var maxProfit = function(prices) {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) {
      if (prices[i] > prices[i - 1]) {
        profit += prices[i] - prices[i - 1]
      }
    }
    return profit
};