/*
 * @Author: Martin
 * @Date: 2020-10-14 23:23:01
 * @LastEditTime: 2020-10-14 23:23:25
 * @FilePath: \Daily_question\src\算法相关\LeetCode_98.js
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
 * @return {boolean}
 */
/**
 * 
 * 利用递归中序遍历，遍历开始 ，
 * 保存当前节点，为下一个节点的遍历做准备，扫描到当前节点时，和上一个节点做比较。
 * 如果大于前一个节点，则继续递归
 */
var isValidBST = function (root) {
    let prev = null;
    const check = (node) => {
      if (node == null) {
        return true;
      }
      if (!check(node.left)) {
        return false;
      }
      if (prev !== null && prev >= node.val) {
        return false;
      }
  
      prev = node.val;
      return check(node.right);
    }
    return check(root);
  };