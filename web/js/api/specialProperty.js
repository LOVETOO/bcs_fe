/**
 * 特殊属性
 * @since 2018-12-28
 */
(function (defineFn) {
	define(['exports'], defineFn);
})(function (api) {

	api.defineHide = defineHide;

	/**
	 * 定义属性【隐藏】，实现【共性隐藏条件】和【个性隐藏条件】的共同控制
	 * @param target 定义的目标
	 * @param commonHideCondition 共性隐藏条件(我的隐藏条件)
	 */
	function defineHide(target, commonHideCondition) {
		//实际的隐藏条件
		var actualHideCondition = commonHideCondition;
		//个性隐藏条件(他们的隐藏条件)
		var selfhoodHideCondition;

		return Object.defineProperty(target, 'hide', {
			/**
			 * 返回实际的隐藏条件
			 */
			get: function () {
				return actualHideCondition;
			},
			/**
			 * @param conditionTheyWantToSet 他们想要设置的隐藏条件
			 */
			set: function (conditionTheyWantToSet) {
				//他们想一直隐藏
				if (conditionTheyWantToSet === true) {
					actualHideCondition = true;
				}
				//恢复控制
				else if (conditionTheyWantToSet === false) {
					actualHideCondition = commonHideCondition;
					console.warn('你对 %o 的 hide 属性赋值为 false，但这个按钮或标签页实际不会总是显示，因为还有基础控制器对它控制(基础控制器会根据共性特征(如：单据状态等)进行控制)。更建议不写这行代码(即只赋值为 true 或 函数)。', this);
				}
				//共同控制
				else if (typeof conditionTheyWantToSet === 'function') {
					if (commonHideCondition === true) { }
					//若同时有条件，结合2者的条件，原则是【充分条件】
					else if (typeof commonHideCondition === 'function') {
						actualHideCondition = function combineHideCondition() {
							return commonHideCondition.apply(this, arguments) || selfhoodHideCondition.apply(this, arguments);
						};

						console.info('你对 %o 的 hide 属性赋值为 函数，实际效果是和基础控制器一同控制显示隐藏(基础控制器会根据共性特征(如：单据状态等)进行控制)。', this);
					}
				}
				else {
					console.error('hide 属性必须是 boolean 或 function 类型，此行代码无效。');
					return;
				}

				selfhoodHideCondition = conditionTheyWantToSet;
			}
		});
	}

	api.defineSameHideOnButtons = defineSameHideOnButtons;

	/**
	 * 对按钮组上的指定ID定义同1个隐藏条件
	 * @param {Buttons} buttons 按钮组
	 * @param {boolean|() => boolean} hideCondition 隐藏条件
	 * @param {string[]} buttonIds 要定义的按钮ID
	 */
	function defineSameHideOnButtons(buttons, hideCondition, buttonIds) {
		buttonIds.forEach(function name(buttonId) {
			defineHide(buttons[buttonId], hideCondition);
		});
	}

	api.defineSameHideOnTabs = defineSameHideOnTabs;

	/**
	 * 对标签组上的指定ID定义同1个隐藏条件
	 * @param {Buttons} tabs 标签组
	 * @param {boolean|() => boolean} hideCondition 隐藏条件
	 * @param {string[]} tabIds 要定义的按钮ID
	 */
	function defineSameHideOnTabs(tabs, hideCondition, tabIds) {
		tabIds.forEach(function name(tabId) {
			defineHide(tabs[tabId], hideCondition);
		});
	}
});