/*
 * @Author: Martin
 * @Date: 2020-10-11 10:04:55
 * @LastEditTime: 2020-12-23 16:54:53
 * @FilePath: \Daily_question\src\算法相关\bfs.js
 */
/**
 * 广度优先遍历（队列和递归）
 * 1.新建一个队列，把根节点入队
 * 2.把队头出队并访问
 * 3.把队头的children挨个入队
 * 4.重复第二三步，直到队列为空
 */ 

const bfs = (root) => {
    const q = [root]
    while (q.length > 0) {
        const n = q.shift()
        console.log(n.val)
        n.children.forEach(child => {
            q.push(child)
        })
    }
}
