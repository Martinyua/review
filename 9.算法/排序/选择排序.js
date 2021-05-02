/*
 * @Author: Martin
 * @Date: 2021-03-23 15:36:06
 * @LastEditTime: 2021-03-23 15:47:41
 * @FilePath: \Spring recruit review\9.算法\排序\选择排序.js
 */
function selectSort(arr){
    let minIndex
    for(let i = 0; i < arr.length; i++){
        minIndex = i
        for(let j = i ;j < arr.length;j++ ){
            if(arr[j] < arr[minIndex]){
                minIndex = j
            }

        }
        [arr[i],arr[minIndex]] = [arr[minIndex],arr[i]]
    }
    return arr
}
console.log(selectSort([3,1,4,2]))