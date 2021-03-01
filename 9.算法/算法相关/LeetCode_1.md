#### 两数之和

* 思路：依次遍历数组的值，根据匹配条件（目标值），找出被匹配的值，用哈希表来储存没被匹配到的数的值和下标，若哈希表中存在需要的值，就返回该值的下标和当前值的下标。

* 步骤：新建一个哈希表，遍历数组的值，逐个找出所需要的匹配对象，没有则记录放进哈希表中，有则返回

* ```js
  var twoSum = function (nums, target) {
      let map = new Map()
      for (let i = 0; i < nums.length; i++) {
          let n = nums[i];
          let n2 = target - n;
          if (map.has(n2)) {
              return [map.get(n2), i]
          } else {
              map.set(n, i)
          }
      }
  };
  ```

* 待续：利用二分查找进行优化

