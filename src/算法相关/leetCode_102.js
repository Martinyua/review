/*
 * @Author: Martin
 * @Date: 2020-10-12 17:14:24
 * @LastEditTime: 2020-10-21 21:13:47
 * @FilePath: \Daily_question\src\算法相关\leetCode_102.js
 */
/**
 * 层序遍历
 * 层序遍历相当于广度优先遍历，但是需要按照不同数组输出
 * 所以需要保证每次出队和入队的节点都是同一层的节点
 * 1.将根节点入队
 * 2.拿到当前队列的长度
 * 3.将当前队列所有的节点出队，加入数组中。并且将他们的子节点入队
 * 4.重复2 3 步直到队列为空
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
    return  res;
};