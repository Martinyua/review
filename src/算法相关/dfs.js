/*
 * @Author: Martin
 * @Date: 2020-10-11 10:01:20
 * @LastEditTime: 2020-11-11 22:00:00
 * @FilePath: \Daily_question\src\算法相关\dfs.js
 */
/**
 * 深度优先遍历
 * 访问根节点，对根节点的children挨个进行深度优先遍历 （递归）
 */

 const dfs = (root) => {
     console.log(root.val)
     root.children.forEach(dfs)
     root.children.forEach(dfs)
 }