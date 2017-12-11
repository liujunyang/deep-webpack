# deep-webpack

从命令行接受入口文件名参数，利用 `esprima` 逐行分析依赖，并在过程中处理好文件的路径，打包过程中替换掉原来 require 的参数为 id ，最终打包成固定格式的一个 webpack 包。

## 目录
* [webpack1打包优化](https://www.zybuluo.com/liujunyang/note/602306)
* [关于 `npm link` 命令](https://github.com/liujunyang/deep-webpack/issues/1)
* [关于 package.json 中的 `bin` 字段](https://github.com/liujunyang/deep-webpack/issues/2)

## 注意

### Object()
`Object(someFn) === someFn  // true`

### es6 模块
使用 es6 方式编写的模块，打包后得到的函数参数中有 "use strict"; 是因为，es6 的模块默认使用严格模式，所以这里会补上。

### 关于 `__dirname`
`__dirname` 指定的是执行的文件所在的目录。
`process.cwd()` 指定的是输入命令时所处于的目录。

