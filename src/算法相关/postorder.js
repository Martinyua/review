/*
 * @Author: Martin
 * @Date: 2020-10-11 10:56:33
 * @LastEditTime: 2020-10-11 10:57:01
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