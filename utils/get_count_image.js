// 本文件用来获取一个随机的图片
// 调用函数后返回的是一个修改好的图片

// 首先引入fs，用来操作本地文件
const fs = require('fs')
// 引入path，用来处理路径
const path = require('path')
// 引入mimeType，简单的进行返回
const mimeType = require('mime-types')
// 引入image_size，获取图片的尺寸
const sizeOf = require('image-size')

// 设置主题素材的路径
const themePath = path.resolve(__dirname, '../assets/theme')
// 创建一个空的主题对象，后面用来储存主题
const themeList = {}

// 使用同步读取的方法，读取文件夹，并且遍历其中的主题，放入对象中
fs.readdirSync(themePath).forEach(theme => {
    // 如果主题不存在的话，放入主题列表，并且创建空的键值对
    if (!(theme in themeList)) themeList[theme] = {}
    // 获取图片列表
    const imgList = fs.readdirSync(path.resolve(themePath, theme))
    // 随后对图片进行遍历即可
    imgList.forEach(img => {
        // 首先获取图片的准确路径(其实就是全部拼在一起)
        const imgPath = path.resolve(themePath, theme, img)
        // 然后获取图片的名称，就是0~9那个
        const name = path.parse(img).name
        // 获取图片的宽和高，解构赋值
        const { width, height } = sizeOf(imgPath)
        // 一切准备就绪，放入主题列表的对应主题下的对应位置
        // 对了！这里的data是一个完整的标签，需要进行处理，所以有一个函数-w-
        themeList[theme][name] = {
            width,
            height,
            data: convertToDatauri(imgPath)
        }
    })
})

// // DEBUG
// console.log(themeList);

// 对图片路径进行一个处理
// 原来是一个普通的路径，比如C:\\1.gif
// 处理后，就是一个标准的base64图片了（一堆的字符串）
function convertToDatauri(path) {
    const mime = mimeType.lookup(path)
    const base64 = fs.readFileSync(path).toString('base64')
    return `data:${mime};base64,${base64}`
}

// 最后一步，返回我们需要的图片element，直接就是html元素，方便使用
// 传入的是一个对象，数字，主题以及长度
function getCountImage({ count, theme = 'moebooru', length = 7 }) {
    // 先判断主题，如果主题存在，就使用，不存在默认
    if (!(theme in themeList)) theme = 'moebooru'
    // 接下来确保count变量表示的数字被转换为一个固定长度字符串
    // 且左侧不足的部分用'0'填充
    // 然后再将得到的字符串拆分成字符数组并赋值给 countArray
    const countArray = count.toString().padStart(length, '0').split('')

    // 设置坐标x，y
    let x = 0, y = 0
    // 接下来左到右的顺序遍历数组，并让parts接收返回值
    // 这里的next其实就是当前元素的值
    const parts = countArray.reduce((acc, next) => {
        // 通过解构赋值，获取图片对应的信息
        const { width, height, data } = themeList[theme][next]
        // 直接定义一个字符串出来，转换为图片的格式
        const image = `${acc}
        <image x="${x}" y="0" width="${width}" height="${height}" xlink:href="${data}" />`

        // 让x自增，相当于移动下一个图片的位置
        x += width
        // 如果纵坐标超出去了，那就超出去吧uwu
        if (height > y) y = height
        return image
    }, '')

    // 全部处理结束，返回一个svg图片
    return `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="${x}" height="${y}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="image-rendering: pixelated;">
        <title>Moe Count</title>
        <g>
          ${parts}
        </g>
    </svg>
    `
}

module.exports = {
    getCountImage
}