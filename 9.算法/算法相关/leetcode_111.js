/*
 * @Author: Martin
 * @Date: 2020-10-10 22:36:40
 * @LastEditTime: 2020-10-11 09:10:20
 * @FilePath: \Daily_question\src\算法相关\leetcode_111.js
 */
/**
 * 
 * 每日一题：二叉树的最小深度；
 * 广度优先遍历
 * 考虑使用广度优先遍历，遇到叶子节点，停止遍历，返回节点层级。
 * 广度优先搜索的性质保证了最先搜索到的叶子节点的深度一定最小。若使用深度优先则需要全部遍历。
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
    if (!root) {
        return 0;
    }
    const q = [[root, 1]];
    while (q.length) {
        const [n, l] = q.shift();
        if (!n.left && !n.right) {
            return l;
        }
        if (n.left) {
            q.push([n.left,l +1]);
        }
        if(n.right) {
            q.push([n.right,l + 1]);
        }
    }
};