/**
 * @file 查找模块所在绝对路径
 * @author youngwind
 * @content 我们在引用模块的时候常常是很简单的,比如用相对路径,比如直接用模块名(该模块实际上在当前文件夹的node_modules里或者在上层文件夹的node_modules里)
 *      所以,程序需要处理各种的调用方式
 */

const fs = require('fs');
const path = require('path');
const co = require('co');

/**
 * 根据模块的标志查找到模块的绝对路径
 * @param {string} moduleIdentifier 模块的标志,可能是模块名/相对路径/绝对路径
 * @param {string} context 上下文,入口js所在目录
 * @returns {*|Promise}
 */
module.exports = function (moduleIdentifier, context) {
    return co(function *() {
        let dir = generateDir(context, moduleIdentifier);   // 至此,生成待查找 dirs
        let result = yield statPromise(dir);
        return result
        // 结果形如: /Users/youngwind/www/fake-webpack/node_modules/fake-style-loader/index.js!/Users/youngwind/www/fake-webpack/node_modules/fake-less-loader/index.js!/Users/youngwind/www/fake-webpack/examples/loader/style.less
    })
};

/**
 * 根据  模块名,生成待查找的路径集合
 * @param {string} context 入口文件所在目录
 * @param {array} identifiers 可能是loader的集合,也可能是模块名
 * @returns {Array}
 */
function generateDir(context, identifier) {
    let dir = ''
    if (path.isAbsolute(identifier)) {
        // 绝对路径
        if (!path.extname(identifier)) {
            identifier += '.js';
        }
        dir = identifier
    } else if (identifier.startsWith('./') || identifier.startsWith('../')) {
        // 相对路径
        dir = generateDir(context, path.resolve(context, identifier))
    }

    return dir
}

/**
 * 判断路径文件是否存在
 * @param {string} path 目标文件路径
 * @returns {Promise}
 */
function statPromise(path) {
    return new Promise(resolve => {
        fs.stat(path, function (err, stats) {
            if (stats && stats.isFile) {
                resolve(path);
                return;
            }
            resolve(false);
        });
    });
}

