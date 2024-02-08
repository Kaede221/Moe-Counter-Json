// 基于原版进行制作
// 几乎每行代码都有注释
// 不再使用数据库

// 引入fs
const fs = require('fs')
// 引入config-yml，用来编写配置文件，方便进行修改
const config = require('config-yml')
// 引入express并创建对象，这个肯定要用的不说了
const express = require('express')
const app = express()
// 引入compression中间件，减小自身体积
const compression = require('compression')
// 引入获取图片用的工具
const gci = require('./utils/get_count_image')
// 设定默认的长度
const PLACES = 7

// 设定静态资源文件夹
app.use(express.static(__dirname + '/assets'))
// 使用中间件
app.use(compression())
// 视图使用pug进行渲染
app.set('view engine', 'pug')

// 主页的路由，直接访问的话，渲染页面即可
app.get('/', (req, res) => {
    // 这里创建一个site，用来获取当前的路径，然后传递给网页
    const site = `${req.protocol}://${req.get('host')}`
    // 渲染并且传递参数
    res.render('index', { site })
})

// 获取图片的路由，这里要用到一个路径参数name
// 这里使用异步，不知道有什么用处
app.get('/get/@:name', async (req, res) => {
    // 获取数据的名字
    const { name } = req.params
    // 获取主题
    const { theme = 'moebooru' } = req.query
    // 设定长度
    let length = PLACES
    // 设定一些请求头
    res.set({
        'content-type': 'image/svg+xml',
        'cache-control': 'max-age=0, no-cache, no-store, must-revalidate'
    })

    // 获取图片
    // 这里用到了一个新的函数，
    const data = await getCountByName(name)

    // 判断是否为演示部分
    if (name === 'demo') {
        res.set({
            'cache-control': 'max-age=31536000'
        })
        length = 10
    }

    // 渲染
    const renderSvg = gci.getCountImage({ count: data.num, theme, length })
    res.send(renderSvg)
})

// 获取图片的函数
async function getCountByName(name) {
    // 设置默认情况
    const defaultCount = { name, num: 0 }
    // 如果是demo的话，那么就返回0~9就好
    if (name === 'demo') return { name, num: '0123456789' }
    // 这里我不调用数据库了，使用json进行计数
    // 获取json
    let data = require('./count.json')
    console.log(data);
    try {
        if (!(name in data)) {
            // 如果不存在，那么创建一个就好
            data[name] = 1
        } else {
            data[name]++
        }
        console.log(data)
        // 读取完成后，保存数据
        fs.writeFile('./count.json', JSON.stringify(data, null, 2), (err) => {
            console.log("写入失败了哦！");
        })
        return { name, num: data[name] }
    } catch (error) {
        console.log("无法通过name创建！");
        console.log(error);
        return defaultCount
    }
}

// getCountByName('kaede')

// 监听
app.listen(config.app.port || 3000, () => {
    // 正常运行
    console.log(`正常运行中！当前端口为 ${config.app.port}`);
})