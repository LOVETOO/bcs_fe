/**
 * 循环相关Api
 * @since 2018-11-11
 */
define(
	['exports'],
	function (api) {

		/**
         * for 循环，此方法相当于 for (var i = start; i < end; i++) { if (looper(i) === true) break; }。
         * 但由于使用了回调，没有额外的使用变量，可避免同名变量互相污染作用域
         * @param {number} [start=0] 循环起点(包含)，可省略，默认为0
         * @param {number} end 循环终点(不包含)
         * @param {(index: number) => boolean} looper 循环回调函数，该函数接受1个参数(循环索引)，返回1个布尔值(为true时中断循环)
         * @return {boolean} 循环是否有中止
		 * @example
		 * > loopApi.forLoop(5, console.log);
		 * < 0
		 * < 1
		 * < 2
		 * < 3
		 * < 4
		 *
		 * > loopApi.forLoop(2, 5, console.log);
		 * < 2
		 * < 3
		 * < 4
		 * @since 2018-11-11
         */
		api.forLoop = function (start, end, looper) {
			if (arguments.length === 2) {
				looper = end;
				end = start;
				start = 0;
			}

			for (var i = start; i < end; i++) {
				//若回调函数显式地返回true，则终止循环
				if (looper(i) === true)
					return true;
			}

			return false;
		};

		/**
         * 遍历月份，即从1遍历到12
         * @param {(index: number) => boolean} looper 循环回调函数，该函数接受1个参数(循环索引)，返回1个布尔值(为true时中断循环)
         * @return {boolean} 循环是否有中止
		 * @since 2018-11-11
         */
		api.forMonth = api.forLoop.bind(api, 1, 13);


        /**
		 * 遍历当前年份以及前后3年的年份
         * @type {*|any}
         */
        api.forYear = api.forLoop.bind(api, new Date().getFullYear()-3, new Date().getFullYear()+4);

	}
);