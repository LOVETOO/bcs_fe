/**
 * 启动流程
 * @since 2019-02-18
 */
(function (defineFn) {
	define(['openBizObj'], defineFn);
})(function (openBizObj) {

	/**
	 * 启动流程
	 * @param params
	 */
	function startWf(params) {
		if ( !('wfTempId' in params) )
			params.wfTempId = -1;

		if ( !('startWf' in params) )
			params.startWf = true;

		return openBizObj(params);
	}

	return startWf;
});