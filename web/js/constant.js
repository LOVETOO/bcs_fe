/**
 * 常量
 * @since 2018-11-24
 */
(function () {

	//常量模块引用
	var constant = getConstClone({
		'defineConstProp': defineConstProp,		//定义单个常量属性
		'defineConstProps': defineConstProps,	//批量定义常量属性
		'getConstClone': getConstClone,			//克隆成常量对象
		'getConstGetter': getConstGetter,		//常量取值器的生成器
		'constSetter': constSetter,				//常量赋值器

		'homePage': 'index.jsp',				//主页面文件
		'objType': {							//对象类型
			workSpace: 1,						//工作区
			fdr: 2,								//文件夹
			doc: 6,								//文件
			org: 12,							//机构
			user: 13							//用户
		}
	});

	define(constant);

	/**
	 * 定义单个常量属性
	 * @param {object} target 定义的目标对象，可省略；省略时，该属性会定义在常量模块引用上
	 * @param {string} constName 常量名
	 * @param constValue 常量值
	 * @return {object} target
	 * @since 2018-11-24
	 */
	function defineConstProp(target, constName, constValue) {
		if (arguments.length <= 2) {
			constValue = constName;
			constName = target;
			target = constant;
		}

		return Object.defineProperty(target, constName, getConstDefinition(constValue));
	}

	/**
	 * 批量定义常量属性
	 * @param {object} [target] 定义的目标对象，可省略；省略时，该属性会定义在常量模块引用上
	 * @param {object} constMap 常量名和值的映射
	 * @return {object} target
	 * @since 2018-11-24
	 */
	function defineConstProps(target, constMap) {
		if (arguments.length <= 1) {
			constMap = target;
			target = constant;
		}

		var definition = {};

		Object.keys(constMap).forEach(function (constName) {
			var constValue = constMap[constName];

			definition[constName] = getConstDefinition(constValue);
		});

		return Object.defineProperties(target, definition);
	}

	/**
	 * 返回对象的常量副本(即返回一个所有属性都是常量的对象，但是，只有被克隆的属性是常量的，克隆之后增加的属性仍是可变的)，此克隆为深层克隆
	 * @param {object} target 目标对象
	 * @return {object}
	 * @since 2018-12-08
	 */
	function getConstClone(target) {
		if (typeof target !== 'object' || target === null)
			throw new Error('无法克隆非对象值');

		var clone = {};

		Object.keys(target).forEach(function (key) {
			var value = target[key];

			if (typeof value === 'object' && value !== null) {
				value = getConstClone(value);
			}

			defineConstProp(clone, key, value);
		});

		return clone;
	}

	/**
	 * 常量取值器的生成器
	 * @param value 常量值
	 * @since 2018-11-24
	 */
	function getConstGetter(value) {
		/**
		 * 常量取值器
		 * @since 2018-11-24
		 */
		return function constGetter() {
			return value;
		};
	}

	/**
	 * 常量赋值器
	 * @param value
	 * @since 2018-11-24
	 */
	function constSetter(value) {
		//保护常量属性的值
		console.error('不允许给常量属性赋值，该操作已被取消，请从源码中删除此行代码。');
	}

	/**
	 * 构造常量定义
	 * @param {*} constValue 常量值
	 * @since 2018-11-26
	 */
	function getConstDefinition(constValue) {
		return {
			get: getConstGetter(constValue),				//常量取值器
			set: constSetter,								//常量赋值器
			enumerable: typeof constValue !== 'function'	//非函数才可枚举
		};
	}

})();