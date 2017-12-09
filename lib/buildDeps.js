/**
 * @file 分析模块依赖,生成模块依赖关系对象depTree
 * @author youngwind
 */

const path = require('path')
const fs =  require('fs')
const co = require('co')
const parse = require('./parse');
const _resolve = require('./_resolve')

let mid = 0;  // module id
let cid = 0; // chunk id

/**
 * 分析处理模块依赖
 * @param {string} mainModule 入口js
 * @param {object} options 构建选项
 * @returns {*|Promise}
 */
module.exports = function (mainModule, options) {
	let depTree = {
    modules: {},            // 用于存储各个模块对象
    chunks: {},             // 存储各个块
    mapModuleNameToId: {},  // 用于映射模块名到模块id之间的关系
    modulesById: {},        // 通过模块id索引模块
  }
	return co(function* (){
		depTree = yield parseModule(depTree, mainModule, options.context, options)
		return depTree
	})
}

/**
 * 分析模块
 * @param {object} depTree 模块依赖关系对象
 * @param {string} moduleName 模块名称,可能是绝对路径,也可能是相对路径,也可能是一个名字
 * @param {string} context 上下文,入口js所在目录
 * @param {object} options 选项
 * @returns {*|Promise}
 */
 function parseModule(depTree, moduleName, context, options) {
 	let module;
 	return co(function *() {
    // 查找模块
    let absoluteFileName = yield _resolve(moduleName, context);
    
    // 用模块的绝对路径作为模块的键值,保证唯一性
    module = depTree.modules[absoluteFileName] = {
    	id: mid++,
    	filename: absoluteFileName,
    	name: moduleName
    };
    // console.log(91, module)

    let filename = absoluteFileName
    if(!filename) {
    	throw `找不到文件${filename}`;
    }

    // esprima 的输入参数是字符串
    let source = fs.readFileSync(filename).toString();
    

    let parsedModule = parse(source);
    module.requires = parsedModule.requires || [];

    module.asyncs = parsedModule.asyncs || [];
    module.source = parsedModule.source;

    // 写入映射关系
    depTree.mapModuleNameToId[moduleName] = mid - 1;
    depTree.modulesById[mid - 1] = module;

    // 如果此模块有依赖的模块,采取深度遍历的原则,遍历解析其依赖的模块
    let requireModules = parsedModule.requires;
    if (requireModules && requireModules.length > 0) {
    	for (let require of requireModules) {
    		depTree = yield parseModule(depTree, require.name, context, options);
    	}
      // 写入依赖模块的id,生成目标JS文件的时候会用到
      requireModules.forEach(requireItem => {
      	requireItem.id = depTree.mapModuleNameToId[requireItem.name]
      })
    }

    return depTree
  });
}