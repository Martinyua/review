/*
 * @Author: Martin
 * @Date: 2020-10-29 22:50:55
 * @LastEditTime: 2020-10-29 23:09:47
 * @FilePath: \Daily_question\src\算法相关\LeetCode_695.js
 */
/**
 * 岛屿的最大面积
 * 使用深度优先遍历，遍历二维数组，遇到1则深度优先遍历（递归），
 * 同时沉岛将1变为0，避免后续重复计算，每次递归当前岛屿的最大面积都加一，
 * 每次递归结束就计算最大值
 */
var maxAreaOfIsland = function (grid) {
    let maxArea = 0
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] === 1) {
                maxArea = Math.max(maxArea, dfs(grid, i, j))
            }
        }
    }
    return maxArea
};
function dfs(grid, i, j) {
    if (i < 0 || j < 0 || i >= grid.length || grid[i].length || grid[i][j] === 0) {
        return 0
    }
    let area = 1
    grid[i][j] = 0
    area += dfs(grid, i + 1, j)
    area += dfs(grid, i - 1, j)
    area += dfs(grid, i, j + 1)
    area += dfs(grid, i + 1, j - 1)
    return area
}