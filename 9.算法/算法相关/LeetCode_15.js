/*
 * @Author: Martin
 * @Date: 2020-11-02 21:16:38
 * @LastEditTime: 2020-11-02 22:14:18
 * @FilePath: \Daily_question\src\算法相关\LeetCode_15.js
 */
/**
 * 三数之和
 * 解题思路：利用双指针，需要先将数组排序，然后遍历0到length-2遍历数组(考虑当前值后面还有start和end)，遍历时判断当前值是否等于前一个值（防止最后的结果重复）
 * 如果重复就跳过，如果不重复，则设置当前值的后一位为指针start，设置最后一位为end。然后判断当前值加上start和end是否为0，如果为零，则将
 * 结果推到数组中，还需要继续缩进指针判断后续的值是否符合要求。如果大于零，则将end左移，如果小于零则将start右移，才能使结果为零。
 */

var threeSum = function (nums) {
  const res = []
  nums.sort((a, b) => a - b)
  for (let i = 0; i < nums.length - 2; i++) {
    if(nums[i] > 0) break
    if (i === 0 || nums[i] !== nums[i - 1]) {
      let start = i + 1, end = nums.length - 1
      while (start < end) {
        if (nums[i] + nums[start] + nums[end] === 0) {
          res.push([nums[i], nums[start], nums[end]])
          start++
          end--
          while (start < end && nums[start] === nums[start - 1]) { start++ }
          while (start < end && nums[end] === nums[end + 1]) { end-- }
        } else if (nums[i] + nums[start] + nums[end] < 0) {
          start++
        } else {
          end--
        }
      }
    }
  }
  return res

};