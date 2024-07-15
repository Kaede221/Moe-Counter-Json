# moe-counter-json

当前直接部署在我的服务器中了, 你可以直接使用:

[http://count.fumoe.top/](http://count.fumoe.top/)

![](http://count.fumoe.top/get/@index?theme=rule34)

## 抛弃DB，使用JSON进行重构

为了方便一些，同时减少代码体积，我构建了这个JSON版本的Moe-Counter，基于[原版](https://github.com/journey-ad/Moe-counter)，但是简单于原版（当然啦，还是要支持原作者哦！）

现在，在项目目录下的`count.json`将作为数据库使用，每次调用都会操作一次文件，修改文件，并且此数据可迁移（毕竟就是个文件嘛，确实简单）

## 中文注释

我可以很自信的说，这个项目不仅仅是一个JSON版本，还可以作为一个完整的NodeJS入门教程！基本上在写代码的时候，NodeJS的各种知识点都运用到了，比如`fs`，`express`，`path`之类的常用模块。

同时，我为每一行代码都书写了注释！（当然啦，是边写主程序边写的，这样子思路连贯一些）

希望你能从中学到什么！

## 使用方法

1. 下载项目源代码
2. 进入源代码目录，并键入`npm install`
3. 运行代码 `node index.js`或者`npm run serve`
4. 访问`127.0.0.1:8000`就可以啦

感谢使用啦！