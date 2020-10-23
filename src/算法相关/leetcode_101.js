/*
 * @Author: Martin
 * @Date: 2020-10-13 19:58:59
 * @LastEditTime: 2020-10-23 22:28:52
 * @FilePath: \Daily_question\src\算法相关\leetcode_101.js
 */
/**
 * 对称二叉树。考虑使用递归。因为为镜像对称，所以需要两个根节点的值相等。
 * 且右和左子节点的值分别等于另一个节点的左和右子节点。
 * 步骤：先比较根节点的left和right，如果不等则直接返回。
 * 如果相等就比较left的左节点和right的右节点。
 * 再比较left的右节点和right的左节点，继续递归比较下面的节点
 */
var isSymmetric = function (root) {
    if (root === null) { return true }
    let check = (node1,node2) => {
        if (!node1 && !node2) { return true }
        if (!node1 || !node2 || node1.val !== node2.val) return false
        return check(node1.left, node2.right) && check(node1.right, node2.left)
    }
    return check(root.left,root.right)
};