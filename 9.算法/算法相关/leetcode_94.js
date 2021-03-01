/*
 * @Author: Martin
 * @Date: 2020-10-11 15:52:57
 * @LastEditTime: 2020-10-11 16:09:13
 * @FilePath: \Daily_question\src\算法相关\leetcode_94.js
 */
/**
 * 二叉树的中序遍历
 * 迭代实现 : 实质上是利用堆栈来模拟实现递归。先将所有的能压入的左子节点压入栈中，然后出栈，
 * 将它的值放入结果中，并让指针指向该左子节点的右子节点，对该右子节点执行上述相同操作（利用迭代）。最后返回结果
 */

const inorderTraversal = (root) => {
    if (!root) { return }
    const res = [];
    const stack = [];
    let p = root;
    while(stack.length || p){ //因为该p节点可能为null
        while (p) {
            stack.push(p);
            p = p.left;
        }
        let n = stack.pop()
        res.push(n)
        p = n.right;
    }
    return res;
};