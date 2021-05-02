#### 无重复字符的最长子串

* 解题思路：

  * 记录所有无重复字符的子串长度，最后返回最大值

* 解题步骤：
  * 用双指针维护一个滑动窗口，用于剪切子串
  * 不断移动右指针，并且将右指针的值和位置存于字典中，当遇到重复字符，就把左指针移动到重复字符的下一位
  * 过程中，记录所有窗口的长度，并且返回最大值

* 实现代码：

  ```js
  var lengthOfLongestSubstring = function(s) {
  	let l = 0;
      let res = 0;
      let map = new Map();
      for (let r = 0; r < s.length;r++) {
          if(map.has(s[r]) && map.get(s[r]) >= l){
             l = map.get(s[r]) + 1
          }
          map.set(s[r],r)
          res = Math.max(res,r - l + 1)
      }
      return res;
  };
  ```

  