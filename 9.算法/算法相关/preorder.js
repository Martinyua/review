/*
 * @Author: Martin
 * @Date: 2020-10-11 09:53:58
 * @LastEditTime: 2020-10-11 11:04:16
 * @FilePath: \Daily_question\src\算法相关\preorder.js
 */

/**
 * 先序遍历（根左右）
 * 递归实现
 */
const preorder = (root) => {
    if (!root) { return }
    console.log(root.val)
    preorder(root.left)
    preorder(root.right)
}

/**
 * 非递归实现
 * 使用堆栈
 * 先将根节点推入栈中
 * 根节点出栈，并且访问根节点，如果存在右节点，则右节点入栈，如果存在左节点，左节点入栈，循环此步骤，直至栈空
 */

const preorder = (root) => {
    if (!root) { return }
    const stack = [root]
    while (stack.length) {
        const n = stack.pop()
        console.log(n.val)
        if (n.right) stack.push(n.right)
        if(n.left) stack.push(n.left)
    }
}
