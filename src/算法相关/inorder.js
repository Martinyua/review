/*
 * @Author: Martin
 * @Date: 2020-10-11 10:56:15
 * @LastEditTime: 2020-10-11 15:50:30
 * @FilePath: \Daily_question\src\算法相关\inorder.js
 */

/**
 * 中序遍历（左根右）
 */

const inorder = (root) => {
    if (!root) { return }
    inorder(root.left)
    console.log(root.val)
    inorder(root.right)
}

/**
 * 迭代实现
 * 利用堆栈
 * 先将所有的左子节点压入栈中，然后栈顶元素出栈，遍历它的值的同时，
 * 将指针指向它的右节点。右节点再次执行以上循环
 */

const inorder = (root) => {
    if (!root) { return }
    const stack = [];
    let p = root;
    while (stack.length || p) {
        while (p) {
            stack.push(p)
            p = p.left
        }
        let n = stack.pop()
        console.left(n.val)
        p = p.right
    }
}