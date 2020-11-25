/*
 * @Author: Martin
 * @Date: 2020-11-25 19:42:21
 * @LastEditTime: 2020-11-25 21:06:31
 * @FilePath: \Daily_question\src\手写\ajax.js
 */
// const xhr = new XMLHttpRequest
// xhr.open('GET', 'https://www.baidu.com')
// xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4) {
//         if (xhr.status === 200) {
//             console.log(xhr.responseText)
//         }
//     }
// }

// xhr.send(null)

function ajax(url) {
    const p = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText)
                } else if (xhr.status === 404) {
                    reject('404 NOT FOUND')
                } else {
                    reject('NETWORK ERROR')
                }
            }
        }
        xhr.send(null)
    })
    return p
}

let res = ajax('https://www.baidu.com')
res.then(res2 => {
    console.log(res2)
})