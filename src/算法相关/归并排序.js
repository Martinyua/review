/*
 * @Author: Martin
 * @Date: 2021-03-23 08:50:31
 * @LastEditTime: 2021-03-23 08:50:47
 * @FilePath: \算法相关\归并排序.js
 */
function mergeSort(arr) {
    let len = arr.length;
    if(len < 2) {
      return arr;
    }
    
    let mid = Math.floor(len / 2),
        left = arr.slice(0, mid),
        right = arr.slice(mid);
    return merge(mergeSort(left), mergeSort(right));
  }
  
  function merge(left, right) {
    let res = [];
    
    while(left.length > 0 && right.length > 0) {
      if(left[0] < right[0]){
        res.push(left.shift());
      } else {
        res.push(right.shift());
      }
    }
    
    res = (left.length || right.length) && left.length ? res.concat(left) : res.concat(right);
    
    return res;
  }