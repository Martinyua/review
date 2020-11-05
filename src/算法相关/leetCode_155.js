/*
 * @Author: Martin
 * @Date: 2020-11-04 22:53:18
 * @LastEditTime: 2020-11-04 23:02:16
 * @FilePath: \Daily_question\src\leetCode_155.js
 */
/**
 * 因为常数时间内检索到栈的最小元素。所以每次入栈，都需要记录最小值。但是考虑到出栈后最小值也会出栈，
 * 所以需要额外的维护一个最小元素栈，当元素出栈时，若他为最小元素，则最小元素栈的元素也要出栈。
 * 入栈时，如果当前元素比当前最小元素小，则进入最小元素栈
 */
var MinStack = function () {
    this.stack = []
    this.min_stack = []
};

/** 
 * @param {number} x
 * @return {void}
 */
MinStack.prototype.push = function (x) {
    this.stack.push(x)
    if (x < this.min_stack[this.min_stack.length - 1] || this.min_stack.length === 0) {
        this.min_stack.push(x)
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function () {
    let out = this.stack.pop()
    if (out === this.min_stack[this.min_stack.length - 1]) {
        this.min_stack.pop()
    }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function () {
    return this.stack[this.stack.length - 1]
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function () {
    return this.min_stack[this.min_stack.length - 1]
};