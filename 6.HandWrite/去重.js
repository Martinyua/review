/*
 * @Author: Martin
 * @Date: 2021-03-22 10:30:21
 * @LastEditTime: 2021-04-08 13:35:13
 * @FilePath: \6.HandWrite\去重.js
 */
// const unique = (arr) => {
//     let res = []
//     arr.forEach(item => {
//         if(res.indexOf(item) === -1){
//             res.push(item)
//         }
//     })
//     return res
// }

// const unique = (arr) => {
//     return [...new Set(arr)]
// }

const unique = (arr) => {
    let res = []
    arr.forEach( item => {
        if(res.indexOf(item) === -1) {
            res.push(item)
        }
    })
    return res
}

console.log(unique([1,1,2,3,3]))

