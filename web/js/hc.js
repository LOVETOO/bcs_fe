/**
 * 定义类
 * @param {function} [SuperClass] 父类（非必须）
 * @param {object} classDescriptor 类描述（必须）
 * @returns 类
 */
function defineClass(SuperClass, classDescriptor) {
    //若未定义父类
    if (typeof SuperClass !== 'function') {
        classDescriptor = SuperClass;
        SuperClass = Object; //则以 Object 为父类
    }

    if (!classDescriptor) {
        throw new Error('类定义错误，类描述不能为空');
    }

    //若定义了构造器
    if (Object.prototype.hasOwnProperty.call(classDescriptor, 'constructor')) {
        if (typeof classDescriptor.constructor !== 'function') {
            throw new Error('类定义错误，构造器必须是一个函数');
        }

        if (classDescriptor.constructor.$isClass) {
            throw new Error('类定义错误，此类已定义，不能重复定义', classDescriptor.constructor);
        }
    }
    else {
        //否则，创建默认的构造器
        classDescriptor.constructor = function Class() {};
    }

    //类
    var Class = classDescriptor.constructor;

    //属性描述
    var propertyDescriptors = {};
    Object.keys(classDescriptor).forEach(function (key) {
        var value = classDescriptor[key],
            isFunction = typeof value === 'function';

        propertyDescriptors[key] = {
            value: value,
            writable: !isFunction,
            configurable: !isFunction
        };
    });

    if (!SuperClass.$isClass) {
        /**
         * 对父类方法调用 call
         */
        propertyDescriptors.$superCall = {
            value: function $superCall(functionName) {
                var args = Array.prototype.slice.call(arguments, 1);
                return this.$superApply(functionName, args);
            }
        };

        /**
         * 对父类方法调用 apply
         */
        propertyDescriptors.$superApply = {
            value: function $superApply(functionName, args) {
                if (typeof functionName !== 'string') {
                    throw new Error('$superApply 的参数【函数名】必须是字符串');
                }

                var prototype = this;

                //查找父类原型
                for (var i = 0; i < 2; i++) {
                    prototype = Object.getPrototypeOf(prototype);
                    if (!prototype) {
                        return;
                    }
                }

                var fn = prototype[functionName];

                if (typeof fn !== 'function') {
                    return;
                }

                return fn.apply(this, args);
            }
        };
    }

    //重建原型
    Object.defineProperties(Class, {
        $isClass: {
            value: true
        },
        prototype: {
            value: Object.create(SuperClass.prototype, propertyDescriptors)
        }
    });

    return Class;
}

/**
 * 对 switch 代码结构的对象化，转为链式调用和回调函数处理
 * 
 * 使用此方式代替传统的 switch，有以下好处
 *     1、传统的 switch 忘记写 break 可能会造成可怕的后果，对象化后不用写 break
 *     2、传统的 switch 代码层次不明显，对象化后代码封装在回调函数里，层次分明
 *     3、回调函数开辟了新的作用域，使得各分支之间的临时变量不会互相污染
 *     4、传统的 switch 的比较方式是固定的，是严格相等（即 ===），对象化后可灵活指定比较方式
 * 
 * 可指定比较方式，默认的比较方式是 SameValueZero
 * 其他比较方式可指定为
 *     '==='：严格相等
 *     '=='：非严格相等
 *     function：自定义相等
 * @example
 * `
 * var v;
 * 
 * v = 1;
 * 
 * //无 default 分支
 * Switch(v)
 *     .case(1, console.log)
 *     .case(2, console.warn)
 *     .case(3, console.error);
 * 
 * //控制台输出>1
 * 
 * v = 4;
 * 
 * //有 default 分支
 * Switch(v)
 *     .case(1, console.log)
 *     .case(2, console.warn)
 *     .case(3, console.error)
 *     .default(console.debug);
 * 
 * //控制台输出>4
 * 
 * v = '1';
 * 
 * //默认使用 SameValueZero 比较
 * Switch(v)
 *     .case(1, console.log)
 *     .case(2, console.warn)
 *     .case(3, console.error)
 *     .default(function (value) {
 *         console.debug('default');
 *     });
 * 
 * //控制台输出>"default"
 * 
 * //使用非严格相等比较（即 ==）
 * Switch(v, '==')
 *     .case(1, console.log)
 *     .case(2, console.warn)
 *     .case(3, console.error)
 *     .default(function (value) {
 *         console.debug('default');
 *     });
 * 
 * //控制台输出>"1"
 * 
 * //多值分支
 * Switch(v)
 *     .case(1, 2, 3, console.log)
 *     .default(function (value) {
 *         console.debug('default');
 *     });
 * `
 * @param {*} value 值
 * @param {string|function} [equals] 比较方式
 * @since 2019-07-04
 */
function Switch(value, equals) {
	if (!(this instanceof Switch)) {
		return new Switch(value, equals);
	}

	this.value = value;

	//默认比较方式：
	if (equals == null) {}
	//严格相等
	else if (equals === '===') {
		this.equals = Switch.strictEquals;
	}
	//非严格相等
	else if (equals === '==') {
		this.equals = Switch.notStrictEquals;
	}
	//自定义相等
	else if (typeof equals === 'function') {
		this.equals = equals;
	}
	else {
		throw new Error('创建Switch对象失败，非法的比较方式：', equals);
	}
}

/**
 * 添加 case 分支
 * @param {*} caseValue 分支的值
 * @param {(value) => void} callback 回调函数
 * @returns 返回 Switch 实例本身
 * @since 2019-07-04
 */
Switch.prototype.case = function (caseValue, callback) {
	var self = this;

	if (!self.matched) {
		var matched, caseValues, actualCallback;

		//单值分支
		if (arguments.length <= 2) {
			actualCallback = callback;
			matched = self.equals(self.value, caseValue);
		}
		//多值分支
		else {
			caseValues = Array.prototype.slice.call(arguments);
			actualCallback = caseValues.pop();
			matched = caseValues.some(function (caseValue) {
				return self.equals(self.value, caseValue);
			});
		}

		if (matched) {
			self.matched = true;

			self.executeCallback(actualCallback);
		}
	}

	return self;
};

/**
 * 添加 default 分支
 * @param {(value) => void} callback 回调函数
 * @returns 返回 Switch 实例本身
 * @since 2019-07-04
 */
Switch.prototype.default = function (callback) {
	if (!this.matched) {
		this.matched = true;
		this.isDefault = true;

		this.executeCallback(callback);
	}

	return this;
};

/**
 * 是否已匹配上分支
 * @type {boolean}
 * @since 2019-07-04
 */
Switch.prototype.matched = false;

/**
 * 是否匹配上默认分支
 * @type {boolean}
 * @since 2019-07-04
 */
Switch.prototype.isDefault = false;

/**
 * 执行回调函数
 * @param {(value) => void} callback 回调函数
 * @since 2019-07-05
 */
Switch.prototype.executeCallback = function (callback) {
	if (typeof callback === 'function') {
		if (this.isDefault) {
			this.result = callback();
		}
		else {
			this.result = callback(this.value);
		}
	}
	else {
		this.result = callback;
	}
};

/**
 * 分支匹配的比较方式
 * @param {*} value switch 的值
 * @param {*} caseValue case 分支的值
 * @returns {boolean}
 * @since 2019-07-04
 */
Switch.prototype.equals = function (value, caseValue) {
	return value === caseValue || (value !== value && caseValue !== caseValue);
};

/**
 * 分支匹配的比较方式：严格相等
 * @param {*} value switch 的值
 * @param {*} caseValue case 分支的值
 * @returns {boolean}
 * @since 2019-07-04
 */
Switch.strictEquals = function (value, caseValue) {
	return value === caseValue;
};

/**
 * 分支匹配的比较方式：非严格相等
 * @param {*} value switch 的值
 * @param {*} caseValue case 分支的值
 * @returns {boolean}
 * @since 2019-07-04
 */
Switch.notStrictEquals = function (value, caseValue) {
	return value == caseValue;
};

/**
 * if else-if else 逻辑分支的函数化
 * 函数化使得各分支变成独立的函数，开辟了各自的作用域，不会使用临时变量互相污染
 */
function IfElse() {}

/**
 * 如果
 * @example
 * `
 * IfElse.if(value, callback);
 * 
 * //相当于
 * 
 * if (value) {
 *     callback(value);
 * }
 * `
 * @since 2019-08-08
 */
IfElse.if = function (value, callback) {
	var ifElse = new IfElse();

	if (value) {
		ifElse.matched = true;
		ifElse.matchedValue = value;
		ifElse.executeCallback(callback);
	}

	return ifElse;
};

/**
 * 是否已匹配上分支
 * @type {boolean}
 * @since 2019-08-08
 */
IfElse.prototype.matched = false;

/**
 * 是否匹配上其他分支
 * @type {boolean}
 * @since 2019-08-08
 */
IfElse.prototype.isElse = false;

/**
 * 否则如果
 * @example
 * `
 * IfElse
 *     .if(value1, callback1)
 *     .elseIf(value2, callback2);
 *
 * //相当于
 *
 * if (value1) {
 *     callback1(value1);
 * }
 * else if (value2) {
 *     callback2(value2);
 * }
 * `
 * @since 2019-08-08
 */
IfElse.prototype.elseIf = function (value, callback) {
	if (!this.matched && value) {
		this.matched = true;
		this.matchedValue = value;
		this.executeCallback(callback);
	}

	return this;
};

/**
 * 否则
 * @example
 * `
 * IfElse
 *     .if(value1, callback1)
 *     .elseIf(value2, callback2)
 *     .else(callback3);
 *
 * //相当于
 *
 * if (value1) {
 *     callback1(value1);
 * }
 * else if (value2) {
 *     callback2(value2);
 * }
 * else {
 *     callback3();
 * }
 * `
 * @since 2019-08-08
 */
IfElse.prototype.else = function (callback) {
	if (!this.matched) {
		this.matched = true;
		this.isElse = true;
		this.executeCallback(callback);
	}

	return this;
};

/**
 * 执行回调函数
 * @param {(value) => void} callback 回调函数
 * @since 2019-08-08
 */
IfElse.prototype.executeCallback = function (callback) {
	if (typeof callback === 'function') {
		if (this.isElse) {
			this.result = callback();
		}
		else {
			this.result = callback(this.matchedValue);
		}
	}
	else {
		this.result = callback;
	}
};

/* ======================================== Object 扩展 ======================================== */
/**
 * 深度冻结
 * @since 2019-10-16
 */
Object.deepFreeze = function (obj) {
    if (typeof obj === 'object' && obj !== null) {
        Object.freeze(obj);

        Object.getOwnPropertyNames(obj).forEach(function (key) {
            var value = obj[key];
            Object.deepFreeze(value);
        });
    }

    return obj;
};

/* ======================================== Array 扩展 ======================================== */

/**
 * 判断数组是否为空
 * @returns {boolean}
 */
Array.prototype.isEmpty = function isEmpty() {
	return this.length === 0;
};

/**
 * 判断数组是否不为空
 * @returns {boolean}
 */
Array.prototype.isNotEmpty = function isNotEmpty() {
	return this.length !== 0;
};

/**
 * 智能追加
 * 
 * 若参数非数组，则和`push`无异；
 * 
 * 若参数是数组，则把数组的元素追加到自身。
 * @param elementsOrArray 元素或数组
 * @returns `this`
 * @since 2019-09-04
 */
Array.prototype.smartPush = function smartPush(elementsOrArray) {
	var self = this;

	Array.prototype.forEach.call(arguments, function (x) {
		if (Array.isArray(x)) {
			x.forEach(function (x) {
				self.push(x);
			});
		}
		else {
			self.push(x);
		}
	});

	return self;
};

/**
 * 智能插入
 * 
 * 若参数非数组，则把参数插入到自身；
 * 
 * 若参数是数组，则把数组的元素插入到自身。
 * @param insertIndex 插入位置
 * @param elementsOrArray 元素或数组
 * @returns `this`
 * @since 2019-09-04
 */
Array.prototype.smartInsert = function smartInsert(insertIndex, elementsOrArray) {
	var t = +insertIndex;

	if (t !== t) {
		throw new Error('非法的插入位置：' + insertIndex);
	}

	if (t < 0 || t > this.length) {
		throw new Error('非法的插入位置：' + insertIndex + '；数组长度：' + this.length);
	}

	insertIndex = t;

	if (arguments.length > 1) {
		var elementsToInsert = [];

		Array.prototype.forEach.call(arguments, function (x, i) {
			if (i === 0) {
				return
			}

			if (Array.isArray(x)) {
				x.forEach(function (x) {
					elementsToInsert.push(x);
				});
			}
			else {
				elementsToInsert.push(x);
			}
		});

		var spliceArgs = elementsToInsert;

		spliceArgs.unshift(insertIndex, 0);

		Array.prototype.splice.apply(this, spliceArgs);
	}

	return this;
};

/**
 * 移除元素
 * @param element
 * @returns {boolean} 是否成功移除（即元素是否在数组内）
 * @since 2019-09-04
 */
Array.prototype.remove = function remove(element) {
	var index = this.indexOf(element);

	var finded = index >= 0;

	if (finded) {
		this.splice(index, 1);
	}

	return finded;
};

/* ======================================== String 扩展 ======================================== */

/* ======================================== 登录 扩展 ======================================== */
function init(initData) {
    initData.isDebug = true;
    initData.rev = 1;
    initData.rn = '';

    (function (userbean) {
        userbean.roleIdMap = {};
        if (userbean.loginuserifnos && userbean.loginuserifnos.length > 0) {
            var stringlist = userbean.loginuserifnos[0].stringofrole.split(",");
            for (var i = 0; i < stringlist.length; i++) {
                userbean.userauth[stringlist[i]] = true;
                userbean.roleIdMap[stringlist[i].toLowerCase()] = true;
            }
        }

        userbean.hasRole = function (roleId, returnTrueWhenHasAdmins) {
            roleId = roleId.toLowerCase();

            if (angular.isUndefined(returnTrueWhenHasAdmins))
                returnTrueWhenHasAdmins = true;

            var result = userbean.roleIdMap[roleId];

            result = result || (returnTrueWhenHasAdmins && userbean.isAdmins);

            return result;
        };
    })(initData.userbean);

    Object.keys(initData).forEach(function (key) {
        var value = initData[key];

        Object.defineProperty(window, key, {
            value: value
        });

        Object.deepFreeze(value);
    });
}