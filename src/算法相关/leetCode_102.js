/*
 * @Author: Martin
 * @Date: 2020-10-12 17:14:24
 * @LastEditTime: 2020-10-12 22:54:11
 * @FilePath: \Daily_question\src\算法相关\leetCode_102.js
 */
var levelOrder = function (root) {
    if (!root) return [];
    const q = [root]
    const res = []
    while (q.length) {
        let l = q.length
        res.push([])
        while (l--) {
            const n = q.shift()
            res[res.length - 1].push(n.val)
            if (n.left) {
                q.push(n.left)
            }
            if (n.right) {
                q.push(n.right)
            }
        }
    }
};