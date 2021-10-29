/**
 * 数字相关Api
 * @since 2018-10-29
 */
define(
    ['exports', 'angular', 'Decimal'],
    function (api, angular, Decimal) {

        var ZERO = Decimal('0'),
            ONE = Decimal('1');

        /**
         * 是NaN吗？
         * @since 2018-11-22
         */
        api.isNaN = function (n) {
            return n !== n;
        };

        /**
         * 把目标转为数字
         * 此方法不返回NaN
         * @param target 转换的目标
         * @param {number} [failReturn] 转换失败时的返回值，默认为0
         * @return {number}
         * @since 2018-10-29
         */
        api.toNumber = function (target, failReturn) {
            //若是字符串，且带逗号，先去掉逗号
            if (angular.isString(target) && target.indexOf(',') !== -1) {
                target = target.replace(/,/g, '');
            }

            var n = Number(target);

            //若是NaN
            if (api.isNaN(n)) n = api.toNumber(failReturn, 0);

            return n;
        };

        function toDecimal(target, failReturn) {
            if (!failReturn) failReturn = ZERO;

            if (typeof target === 'string' && target.indexOf(',') > -1)
                target = target.replace(/,/g, '');

            try {
                return Decimal(target);
            }
            catch (e) {
                return failReturn;
            }
		}

		/**
		 * 按数字标准正常化，无法正常化的返回空字符串
		 * @param value
		 */
		api.normalizeAsNumber = function (value) {
			if (value === undefined || value === null || value === '' || value !== value) {
				return '';
			}

			var type = typeof value;

			if (type === 'number') {}
			else if (type === 'string') {
				value = value.trim();
				value = value.replace(/,/g, '');

				var testValue = +value;

				if (testValue !== testValue) {
					value = '';
				}
			}
			else {
				value = '';
			}

			return value;
		};
		
		/**
		 * 格式化数字
		 * @param value
		 * @param {number} scale 小数位数
		 */
		api.formatNumber = function (value, scale) {
			if (value === undefined || value === null || value === '') {
				return '';
			}

			if (value !== value) {
				return '非法的数字格式: ' + value;
			}

			var type = typeof value,
				isString = type === 'string',
				isNumber = type === 'number',
				isDecimal = value instanceof Decimal;
				isPercent = false;

			if (!isString && !isNumber && !isDecimal) {
				return '非法的数字格式: ' + value;
			}

			if (isString) {
				value = value.trim();

				value = value.replace(/,/g, '');
				
				if (value[value.length - 1] === '%') {
					isPercent = true;
					value = value.substring(0, value.length - 1);
				}
			}

			var decimal;

			if (isDecimal) {
				decimal = value;
			}
			else {
				try {
					decimal = Decimal(value);
				}
				catch (error) {
					if (error.message && error.message.includes('DecimalError')) {
						return '非法的数字格式: "' + value + '"';
					}
					else {
						throw error;
					}
				}
			}

			if (isPercent) {
				decimal = decimal.div(100);
			}

			//转字符串
			var string = decimal.toFixed(scale);

			var charArray = Array.prototype.slice.call(string);

			//最后一个小数点的位置
			var lastIndexOfDot = charArray.lastIndexOf('.');

			var start, end, index;

			//若有小数点
			if (lastIndexOfDot >= 0) {
				start = lastIndexOfDot - 1;		//从小数点前一位开始

				//   ↓
				//1000.00
			}
			else {
				start = charArray.length - 1;	//最后一位开始

				//   ↓
				//1000
			}

			//若是负数
			if (charArray[0] === '-') {
				end = 1;

				//  ↓
				//-1000
			}
			else {
				end = 0;

				// ↓
				//1000
			}

			//位数累计
			var digits = 0;

			for (index = start; index > end; index--) {
				digits++;

				//每隔3位
				if (digits === 3) {
					digits = 0;

					//插入千分号
					charArray.splice(index, 0, ',');
				}
			}

			string = charArray.join('');

			return string;
		};

        /**
         * 把数字转为金额格式
         * @param {number} value
         * @return {string}
         */
		api.toMoney = function (value) {
			return api.formatNumber(value, 2);
        };


        /**
         * 类型是字符串且内容是数字吗？
         * @param any
         * @returns {boolean}
         */
        api.isStrOfNum = function (any) {
            return angular.isString(any) && /^-?\d{1,3}(,?\d{3})*(\.\d+)?$/.test(any);
        };

        /**
         * 是数字吗？
         * @param any
         * @returns {boolean}
         */
        api.isNum = function (any) {
            return angular.isNumber(any) && any === any;
        };

        /**
         * 判断是否整数
         * @param any
         * @returns {boolean|*}
         */
        api.isInt = function (any) {
            return api.isNum(any) && any % 1 === 0;
        }
        /**
         * 求和
         * 求和的元素必须是数字或可以转为数字的字符串，否则会视为0
         * @example
         * ```js
         * numberApi.sum(0.1, '0.2', 0.3) === 0.6; //多项求和
         * numberApi.sum([0.1, '0.2', 0.3]) === 0.6; //求数字数组的和
         * var objArray = [{
		 *     amt: 0.1
		 * }, {
		 *     amt: '0.2'
		 * }, {
		 *     amt: 0.3
		 * }];
         * numberApi.sum(objArray, 'amt') === 0.6; //求对象数组的某一字段的和，推荐用于表格数据求和
         * ```
         * @since 2018-12-03
         */
        api.sum = function () {
            var numbers;

            if (angular.isArray(arguments[0])) {
                var key = arguments[1];
                if (angular.isString(key)) {
                    var objs = arguments[0];
                    numbers = objs.map(function (obj) {
                        return obj[key];
                    });
                }
                else {
                    numbers = arguments[0];
                }
            }
            else {
                numbers = Array.prototype.slice.call(arguments);
            }

            if (numbers.length === 0) return 0;

            var decimals = numbers.map(function (number) {
                return toDecimal(number);
            });

            return +decimals.reduce(function (result, currDecimal) {
                return result.add(currDecimal);
            });
        };


        /**
         * 连乘
         * 连乘的元素必须是数字或可以转为数字的字符串，否则会视为0
         * @example
         * ```js
         * numberApi.mutiply(0.1, '0.2', 0.3) === 0.006; //多项求积
         * numberApi.mutiply([0.1, '0.2', 0.3]) === 0.006; //求数字数组的积
         * var objArray = [{
		 *     amt: 1
		 * }, {
		 *     amt: '2'
		 * }, {
		 *     amt: 3
		 * }];
         * numberApi.mutiply(objArray, 'amt') === 6; //求对象数组的某一字段的积，推荐用于表格数据求积
         * ```
         * @since 2018-12-03
         */
        api.mutiply = function () {
            var numbers;

            if (angular.isArray(arguments[0])) {
                var key = arguments[1];
                if (angular.isString(key)) {
                    var objs = arguments[0];
                    numbers = objs.map(function (obj) {
                        return obj[key];
                    });
                }
                else {
                    numbers = arguments[0];
                }
            }
            else {
                numbers = Array.prototype.slice.call(arguments);
            }

            if (numbers.length === 0) return 0;

            var decimals = numbers.map(function (number) {
				return toDecimal(number);
            });

            return +decimals.reduce(function (result, currDecimal) {
                return result.mul(currDecimal);
            });
        };

        /**
         *是否相等
         * @param field1
         * @param field2
         * @returns {boolean}
         */
        api.equal = function (field1, field2) {
            return api.compare(field1, field2) == 0 ? true : false;
        };

        /**
         * 是否不相等
         * @param field1
         * @param field2
         * @returns {boolean}
         */
        api.notEqual = function (field1, field2) {
            return !api.equal(field1, field2);
        };

        /**
         * 比较大小
         * @param field1
         * @param field2
         * @returns {*|number}
         */
        api.compare = function (field1, field2) {
            field1 = toDecimal(field1);
            field2 = toDecimal(field2);
            return field1.cmp(field2);
        };
        /**
         * 相减
         * @param field1
         * @param field2
         */
        api.sub = function (field1, field2) {
            field1 = toDecimal(field1);
            field2 = toDecimal(field2);
            return +field1.sub(field2);
        };

        /**
         * 相除
         * @param field1
         * @param field2
         */
        api.divide = function (field1, field2) {
            try {
                field1 = toDecimal(field1);
                field2 = toDecimal(field2, ONE);
                return +field1.div(field2);
            }
            catch (error) {
                console.log(error);
                return 0;
            }
        };

        /**
         * 整数转二进制
         * @param intvar 整数字符
         * @param len 指定转换的二进制长度 长度不足的在前面补0
         * @returns {string}
         * add by wzf 2019-02-18
         */
        api.inttobin = function (intvar, len) {
            var strbin = (api.toNumber(intvar)).toString(2);
            //如果指定的长度和转换的二进制字符串不为空，且二进制字符串长度小于指定的长度则在前面补0
            if (len && strbin && strbin.length < len) {
                var num = len - strbin.length;
                for (var i = 0; i < num; i++) {
                    strbin = "0" + strbin;
                }
            }
            return strbin;
        };

        /**
         * 二进制转十进制
         * @param binvar 二进制字符串
         * @returns {Number}
         * add by wzf 2019-02-18
         */
        api.bintoint = function (binvar) {
            return parseInt(binvar, 2);
        };

        /**
         *  金额转人民币中文大写
         * @param num
         * @returns {*}
         */
        api.moneyToRMB = function (money) {
            if (api.isNum(money) || api.isStrOfNum(money)) {
                return convertCurrency(money);
            }
            return money;

            function convertCurrency(money) {
                //汉字的数字
                var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
                //基本单位
                var cnIntRadice = new Array('', '拾', '佰', '仟');
                //对应整数部分扩展单位
                var cnIntUnits = new Array('', '万', '亿', '兆');
                //对应小数部分单位
                var cnDecUnits = new Array('角', '分', '毫', '厘');
                //整数金额时后面跟的字符
                var cnInteger = '整';
                //整型完以后的单位
                var cnIntLast = '元';
                //最大处理的数字
                var maxNum = 999999999999999.9999;
                //金额整数部分
                var integerNum;
                //金额小数部分
                var decimalNum;
                //输出的中文金额字符串
                var chineseStr = '';
                //分离金额后用的数组，预定义
                var parts;
                if (money == '') {
                    return '';
                }
                money = api.toNumber(money);
                if (money >= maxNum) {
                    //超出最大处理数字
                    return '';
                }
                if (money == 0) {
                    chineseStr = cnNums[0] + cnIntLast + cnInteger;
                    return chineseStr;
                }
                //转换为字符串
                money = money.toString();
                if (money.indexOf('.') == -1) {
                    integerNum = money;
                    decimalNum = '';
                } else {
                    parts = money.split('.');
                    integerNum = parts[0];
                    decimalNum = parts[1].substr(0, 4);
                }
                //获取整型部分转换
                if (parseInt(integerNum, 10) > 0) {
                    var zeroCount = 0;
                    var IntLen = integerNum.length;
                    for (var i = 0; i < IntLen; i++) {
                        var n = integerNum.substr(i, 1);
                        var p = IntLen - i - 1;
                        var q = p / 4;
                        var m = p % 4;
                        if (n == '0') {
                            zeroCount++;
                        } else {
                            if (zeroCount > 0) {
                                chineseStr += cnNums[0];
                            }
                            //归零
                            zeroCount = 0;
                            chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                        }
                        if (m == 0 && zeroCount < 4) {
                            chineseStr += cnIntUnits[q];
                        }
                    }
                    chineseStr += cnIntLast;
                }
                //小数部分
                if (decimalNum != '') {
                    var decLen = decimalNum.length;
                    for (var i = 0; i < decLen; i++) {
                        var n = decimalNum.substr(i, 1);
                        if (n != '0') {
                            chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                        }
                    }
                }
                if (chineseStr == '') {
                    chineseStr += cnNums[0] + cnIntLast + cnInteger;
                } else if (decimalNum == '') {
                    chineseStr += cnInteger;
                }
                return chineseStr;
            }
        }

    }
);