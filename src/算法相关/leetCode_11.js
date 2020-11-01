/*
 * @Author: Martin
 * @Date: 2020-11-01 21:58:13
 * @LastEditTime: 2020-11-01 21:58:55
 * @FilePath: \Daily_question\src\算法相关\leetCode_11.js
 */
/**
 * 盛水最多的容器
 * 相当于计算最大面积。定义一个双指针，从两端向中间遍历，
 * 重点是两端指针如何移动，因为最大的容积的高度是由比较低的元素决定的，
 * 移动较高的元素对面积变大没有帮助，所以只有移动较低的元素才有可能使容积变大。
 */
var maxArea = function(height) {
    let max = 0;
    let left = 0;
    let right = height.length -1 ;
    while(left < right){
      let currArea = (right - left)*Math.min(height[right],height[left])
      if(currArea > max){
        max = currArea
      }
      if(height[right] > height[left]){
        left++
      }else{
        right--
      }
    }
    return max
  };