/*
 * @Author: Martin
 * @Date: 2020-10-11 09:02:47
 * @LastEditTime: 2020-10-11 09:11:46
 * @FilePath: \Daily_question\src\算法相关\leetCode_141.js
 */
/** 
 * 题目：判断链表是否有环
 * 考虑使用快慢指针
 * 思路：两人在环形跑道上的相同起点同时起跑，速度快的一定会超过速度慢的一圈，并且相遇。
 * 用快慢两个指针遍历整个链表，如果相逢，则有环
 * 
 */
var hasCycle = function (head) {
    let p1 = head;
    let p2 = head;
    while (p1 && p2 && p2.next) {
        p1 = p1.next;
        p2 = p2.next.next;
        if (p1 = p2) {
            return true;
        }
    }
    return false;
}