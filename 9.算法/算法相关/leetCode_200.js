/*
 * @Author: Martin
 * @Date: 2020-10-21 21:23:22
 * @LastEditTime: 2020-10-21 21:42:16
 * @FilePath: \Daily_question\src\算法相关\leetCode_200.js
 */
/**
 * 岛屿数量
 * 思路：因为岛屿是被零包围的，所以需要找出所有与某一个岛屿相连的1.考虑使用递归
 * 即找出1和它所有相连的1，并且把他相邻的1变为0（利用递归），
 * 终止条件为边界，或者当前值以为0，
 * 在执行递归前，将岛屿数加1.
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function (grid) {
    let count = 0;
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === '1') {
          count++;
          toZero(i, j, grid);
        }
      }
    }
    return count
  };
  function toZero(i, j, grid) {
    if (grid[i] === undefined || grid[i][j] === undefined || grid[i][j] === '0') {
      return
    }
    grid[i][j] = '0';
    toZero(i + 1, j, grid)
    toZero(i - 1, j, grid)
    toZero(i, j + 1, grid)
    toZero(i, j - 1, grid)
  }