/**
 * @file 将各个模块写入目标文件
 * @author liujunyang
 */

const writeSource = require('./writeSource')

/**
 * 根据模块的标志查找到模块的绝对路径
 * @param {object} depTree 
 * @returns {string}
 */
module.exports = function (depTree) {
	let modules = depTree.modulesById;
  let buffer = [];
  for (let moduleId in modules) {

    let module = depTree.modulesById[moduleId];
    buffer.push('/******/');
    buffer.push(module.id);
    buffer.push(': function(module, exports, require) {\n\n');

    // buffer.push(module.source);
    buffer.push(writeSource(module, depTree));

    buffer.push('\n\n/******/ },\n/******/\n');
  }
  return buffer.join('');
};