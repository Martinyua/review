/*
 * @Author: Martin
 * @Date: 2020-10-17 22:59:38
 * @LastEditTime: 2020-10-19 23:24:14
 * @FilePath: \Daily_question\src\算法相关\LeetCode_46.js
 */
/**
 * 全排列
 * 因为是要找到所有的解，所以需要用到回溯。
 * 首先通过递归模拟出所有的情况。遇到重复元素，就回溯，去别的分支继续搜。
 * 收集到所有到的递归终点的情况，就返回。
 * 
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function (nums) {
    const res = [];
    const backtrack = (path) => {
      if (path.length === nums.length) {
        res.push(path)
        return
      }
      nums.forEach(n => {
        if (path.includes(n)) {
          return;
        }
        backtrack(path.concat(n))
      })
    }
    backtrack([]);
    return res;
  }