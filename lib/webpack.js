/**
 * @file  webpack主程序入口
 * @author  liujunyang
 */

const path = require('path')
const fs =  require('fs')
const co = require('co')
const templateSingle = fs.readFileSync(path.join(__dirname, './templateSingle.js'))

console.log(co)

module.exports = function (mailModule, options) {
	console.log(99, mailModule)
}