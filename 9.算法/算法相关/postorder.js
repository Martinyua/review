/*
 * @Author: Martin
 * @Date: 2020-10-11 10:56:33
 * @LastEditTime: 2020-10-11 16:55:14
 * @FilePath: \Daily_question\src\算法相关\postorder.js
 */
/**
 * 后序遍历（左右根）
 */
const postorder = (root) => {
    if (!root) { return }
    postorder(root.left)
    postorder(root.right)
    console.log(root.val)
}

/**
 * 迭代实现
 * 通过之前用堆栈迭代实现前序遍历，将结果倒置，并将做变为右
 */

const postorder = (root) => {

    const outputStack = []
    const stack = [root]
    while (stack.length) {
        const n = stack.pop();
        outputStack.push(n)
        if(n.left) stack.push(n.left)
        if(n.right) stack.push(n.right)
    }
    while(outputStack.length){
        const n = outputStack.pop()
        console.log(n)
    }
}