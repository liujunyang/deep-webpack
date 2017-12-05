/**
 * @file  webpack主程序入口
 * @author  liujunyang
 */

const path = require('path')
const fs =  require('fs')
const co = require('co')
const templateSingle = fs.readFileSync(path.join(__dirname, './templateSingle.js'))

/**
 * 负责调用其他模块
 * @param {string} mainModule 主入口模块
 * @param {object} options 构建的选项
 */
module.exports = function (mailModule, options) {
	co(function* () {
		let buffer = []
		let filename = options.output + options.outputPostfix

		buffer.push(templateSingle)
		buffer.push('/******/ ({\n')
		buffer.push('/******/ //hello\n')
		buffer.push('/******/ })')
		buffer = buffer.join('')

		fs.writeFile(filename, buffer, 'utf-8', err => {
			if (err) {
				throw err
			}
		})

	}).catch(err => {
		console.error(`出错了${err}, ${err.stack}`)
	})
}