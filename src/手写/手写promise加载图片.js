/*
 * @Author: Martin
 * @Date: 2020-11-24 16:46:41
 * @LastEditTime: 2020-11-24 17:07:20
 * @FilePath: \Daily_question\src\手写\手写promise加载图片.js
 */
function loadImg(url) {
    return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => {
            const err = new Error('图片加载失败')
            reject(err)
        }
        img.src = url
    })
}

const url = 'https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white-d0c9fe2af5.png'
loadImg(url).then(img => {
    console.log(img.height)
    return img
}).then( img => {
    console.log(img.width)
})