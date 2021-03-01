/*
 * @Author: Martin
 * @Date: 2020-10-09 23:23:34
 * @LastEditTime: 2020-10-10 20:51:49
 * @FilePath: \undefinedc:\Users\Lenovo\Desktop\Daily_question\src\o_6.js
 */
// 1. 使用一个数组 res保存结果
// 2. 使用 while 循环遍历链表
// 3. 每次循环将值使用 unshift() 方法将节点值存到数组中，指向下一个节点

var reversePrint = function(head) {
  const res = []
   
  while(head !== null) {
    res.unshift(head.val)
    head = head.next
  }
  
  return res

};


