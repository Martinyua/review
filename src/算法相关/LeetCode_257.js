/*
 * @Author: Martin
 * @Date: 2020-10-16 22:58:58
 * @LastEditTime: 2020-10-25 23:32:11
 * @FilePath: \Daily_question\src\算法相关\LeetCode_257.js
 */
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {string[]}
 * 考察二叉树的深度优先遍历。利用递归的方法，自顶向下遍历整个二叉树。
 * 如果当前的节点为叶子节点时，则保存一条路径，通过递归找出所有的路径，
 * 还需要访问每一个节点后把它从path中删除。
 */
var binaryTreePaths = function (root) {
  let path = [];
  let res = [];
  let dfs = (node) => {
    if (node == null) return;
    path.push(node);
    dfs(node.left);
    dfs(node.right);
    if (!node.left && !node.right)
      res.push(path.map(item => item.val).join('->'));
    path.pop();
  }
  dfs(root);
  return res;
};