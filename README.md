# deep-webpack

## 注意
`Object(someFn) === someFn  // true`

使用 es6 方式编写的模块，打包后得到的函数参数中有 "use strict"; 是因为，es6 的模块默认使用严格模式，所以这里会补上。

### 关于 `bin` 字段
[阮一峰](http://javascript.ruanyifeng.com/nodejs/packagejson.html#toc4)
[链接2](https://github.com/wy-ei/notebook/issues/42)

`bin` 项用来指定各个内部命令对应的可执行文件的位置。
```js
"bin": {
  "someTool": "./bin/someTool.js"
}
```

上面代码指定，someTool 命令对应的可执行文件为 bin 子目录下的 someTool.js。Npm会寻找这个文件，在node_modules/.bin/目录下建立符号链接。在上面的例子中，someTool.js会建立符号链接npm_modules/.bin/someTool。由于node_modules/.bin/目录会在运行时加入系统的PATH变量，因此在运行npm时，就可以不带路径，直接通过命令来调用这些脚本。

因此，像下面这样的写法可以采用简写。
```js
scripts: {  
  start: './node_modules/someTool/someTool.js build'
}

// 简写为

scripts: {  
  start: 'someTool build'
}
```
所有node_modules/.bin/目录下的命令，都可以用npm run [命令]的格式运行。在命令行下，键入npm run，然后按tab键，就会显示所有可以使用的命令。

比如在 package.json 中有这样的内容：
```js
{
    "scripts":{
        "build": "webpack"
    }
}
```
为了运行 build 命令，需要执行 npm run build，在使用 npm run 的时候会将 node_modules/.bin 加入环境变量 PATH 中，在命令执行完了再移除，因此你不需要写成：`"build": "./node_modules/.bin/webpack"`。

bin 默认是 json 对象，但是[也可以是字符串](https://docs.npmjs.com/files/package.json#bin)。这时相当于简写：
```js
{
	"name": "my-program",
	"version": "1.2.5",
	"bin": "./path/to/program" 
}

// would be the same as this:
{
	"name": "my-program",
	"version": "1.2.5",
	"bin" : {
		"my-program" : "./path/to/program"
	}
}
```






