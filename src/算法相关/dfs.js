/*
 * @Author: Martin
 * @Date: 2020-10-11 10:01:20
 * @LastEditTime: 2020-10-11 10:04:14
 * @FilePath: \Daily_question\src\算法相关\深度优先遍历.js
 */
/**
 * 深度优先遍历
 * 访问根节点，对根节点的children挨个进行深度优先遍历 （递归）
 */

 const dfs = (root) => {
     console.log(root.val)
     root.children.forEach(dfs)
 }