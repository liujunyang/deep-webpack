/**
 * @file 将依赖模块名替换成依赖模块id
 * @author  liujunyang
 * @content 通过检查 requires 字段中有无需要替换的，轮询替换，处理 requires 的部分在 parse.js 中进行了。
 */


/**
 * 将依赖模块名替换成依赖模块id
 * @param {object} module 模块对象
 * @param {object} depTree 模块依赖关系对象
 * @returns {string} 替换模块名之后的模块内容字符串
 */
module.exports = function (module, depTree) {

    console.log(99, module)

    let replaces = [];
    let source = module.source;
    if (!module.requires || !module.requires.length) return source;

    /**
     * 收集模块中的require
     * @param {object} requireItem 依赖的模块
     */
    function genReplaceRequire(requireItem) {
        if (!requireItem.nameRange || !requireItem.name) return;
        let prefix = `/* ${requireItem.name} */`;
        replaces.push({
            from: requireItem.nameRange[0],
            to: requireItem.nameRange[1],
            value: prefix + (requireItem.id || depTree.mapModuleNameToId[requireItem.name])
        });
        // TODO 此处通过模块名来索引id,可能存在一定的隐患
    }

    if (module.requires) {
        module.requires.forEach(genReplaceRequire);
    }

    // 排序,从后往前地替换模块名,这样才能保证正确替换所有的模块
    replaces.sort((a, b) => {
        return b.from - a.from;
    });

    // 逐个替换模块名为模块id,此处算法颇为精妙,赞!
    let result = [source];
    replaces.forEach(replace => {
        let remainSource = result.shift();
        result.unshift(
            remainSource.substr(0, replace.from),
            replace.value,
            remainSource.substr(replace.to)
        )
    });
    
    return result.join('');
};



