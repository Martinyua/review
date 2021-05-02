/*
 * @Author: Martin
 * @Date: 2020-10-11 19:17:45
 * @LastEditTime: 2020-10-11 19:50:34
 * @FilePath: \Daily_question\src\算法相关\LeetCode_104.js
 */
/**
 * 二叉树的最大深度
 * 利用深度优先遍历，并且记录每个节点的层级。每当一个节点调用一次递归函数，它的层级就会加一。
 * 
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function (root) {
    let res = 0;
    const dfs = (n, level) => {
      if (!n) { return }
      if (!n.left && !n.right) {
        res = Math.max(res, level)
      }
      console.log(n.val, level)
      dfs(n.left, level + 1)
      dfs(n.right, level + 1)
    }
    dfs(root, 1);
    return res;
  };