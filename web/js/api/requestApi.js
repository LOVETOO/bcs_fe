/**
 * 请求
 */
define(['jquery', 'app', 'swalApi'], function ($, app, swalApi) {

    var wfApi;

    require(['wfApi'], function () {
        wfApi = arguments[0];
    });

    return ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

        /**
         * 异步业务请求
         * @param params = {
         *     classId: 类ID
         *     action: 请求名
         *     data: 请求数据
         *     noShowError: 不显示错误
         *     noShowWaiting: 不显示等待
         * }
         */
        function request(params) {
            if (typeof arguments[0] === 'string')
                return request({
                    classId: arguments[0],
                    action: arguments[1],
                    data: arguments[2]
                });
            
            params = params || {};
            params.action = params.action || 'search';

            if (!params.noShowWaiting)
                IncRequestCount('post');
                
            params.data = params.data || {};

            Switch(params.classId)
                .case('scpwf', function () {
                    params.data = wfApi.processWFBeforeRequest(params.data);
                })
                .case('scpwfproc', function () {
                    params.data = wfApi.processProcBeforeRequest(params.data);
                });
                
            var httpPromise = $http({
                method: 'POST',
                url: '/jsp/req.jsp',
                data: params.data,
                params: {
                    classid: params.classId,
                    action: params.action,
                    format: 'mjson',
                    id: Math.random(),
                    userid: strUserId
                    //loginguid: strLoginGuid
                },
                //头部添加ajax标记让后台启用gzip压缩
                headers: { 'ajax': 'true' }
            });

            httpPromise.finally(function () {
                if (!params.noShowWaiting)
                    DecRequestCount();
            });
           
            var resultPromise = httpPromise.then(
                function (response) {
                    if (params.classId === 'scpwf' && params.action === 'select') {
                        wfApi.processWFAfterRequest(response.data);
                    }

                    /**
                     * 触发请求成功事件
                     * @param {Window} theWindow 窗口
                     */
                    (function triggerEvent(theWindow) {
                        //跨域时不传播事件
                        try {
                            theWindow.document;
                        } catch (error) {
                            return;
                        }

                        if (!theWindow.$ || !theWindow.$.fn || !theWindow.$.fn.trigger) return;

                        setTimeout(function () {
                            theWindow.$(theWindow.document).trigger('hc.request.success', {
                                classId: params.classId,
                                action: params.action,
                                data: response.data
                            });
                        });

                        Array.prototype.forEach.call(theWindow.frames, triggerEvent);
                    })(top);

                    return response.data;
                },
                function (response) {
                    var reason;
                    if (response.data && response.data.message) {
                        reason = response.data.message;
                        
                        (function () {
                            var matchedResult = /([\s\S]+)(\(\d+,\w+,\w+\))/.exec(reason);

                            if (!matchedResult) {
                                return;
                            }

                            reason = matchedResult[1] + '\n\n' + matchedResult[2];
                        })();
                    }
                    else {
                        reason = '请求失败：' + response.status;
                    }

                    console.error('请求失败', reason, response);
                    
                    /**
                     * 触发请求失败事件
                     * @param {Window} theWindow 窗口
                     */
                    (function triggerEvent(theWindow) {
                        //跨域时不传播事件
                        try {
                            theWindow.document;
                        } catch (error) {
                            return;
                        }

                        if (!theWindow.$ || !theWindow.$.fn || !theWindow.$.fn.trigger) return;

                        setTimeout(function () {
                            theWindow.$(theWindow.document).trigger('hc.request.error', {
                                classId: params.classId,
                                action: params.action,
                                response: response
                            });
                        });

                        Array.prototype.forEach.call(theWindow.frames, triggerEvent);
                    })(top);

                    if (params.noShowError)
                        return $q.reject(reason);

                    return swalApi.error(reason)
                        .then(function () {
                            return $q.reject(reason);
                        });
                }
            );

            httpPromise.then(
                function (response) {
                    var eventsOfClass = events[params.classId];

                    if (eventsOfClass) {
                        var eventsOfAction = eventsOfClass[params.action];

                        if (eventsOfAction) {
                            eventsOfAction.eventsOfSuccess.forEach(function (eventHandler) {
                                setTimeout(function () {
                                    return eventHandler({
                                        classId: params.classId,
                                        action: params.action,
                                        data: response.data
                                    });
                                });
                            });
                        }

                        eventsOfAction = eventsOfClass.$all;

                        if (eventsOfAction) {
                            eventsOfAction.eventsOfSuccess.forEach(function (eventHandler) {
                                setTimeout(function () {
                                    return eventHandler({
                                        classId: params.classId,
                                        action: params.action,
                                        data: response.data
                                    });
                                });
                            });
                        }
                    }
                },
                function (response) {
                    var eventsOfClass = events[params.classId];

                    if (eventsOfClass) {
                        var eventsOfAction = eventsOfClass[params.action];

                        if (eventsOfAction) {
                            eventsOfAction.eventsOfError.forEach(function (eventHandler) {
                                setTimeout(function () {
                                    return eventHandler({
                                        classId: params.classId,
                                        action: params.action,
                                        data: params.data,
                                        response: response
                                    });
                                });
                            });
                        }

                        eventsOfAction = eventsOfClass.$all;

                        if (eventsOfAction) {
                            eventsOfAction.eventsOfError.forEach(function (eventHandler) {
                                setTimeout(function () {
                                    return eventHandler({
                                        classId: params.classId,
                                        action: params.action,
                                        data: params.data,
                                        response: response
                                    });
                                });
                            });
                        }
                    }
                }
            );

            return resultPromise;
        }

        /**
         * post请求
         * @param params
         * @returns {*}
         */
        request.post = request;
        
        /**
         * 同步业务请求
         * @param params `{
         *     classId: 类ID
         *     action: 请求名
         *     data: 请求数据
         *     noShowError: 不显示错误
         *     noShowWaiting: 不显示等待
         * }`
         * @deprecated 请尽量不要使用同步请求
         */
        request.syncPost = function (params) {
            if (typeof arguments[0] === 'string')
                return request.syncPost({
                    classId: arguments[0],
                    action: arguments[1],
                    data: arguments[2],
                });
            
            params = params || {};
            
            if (!params.noShowWaiting)
                IncRequestCount('post');

            var url, result, isError, reason;

            url = '/jsp/req.jsp'
                //+ '?loginguid=' + window.strLoginGuid
                + '?userid=' + strUserId
                + '&format=mjson'
                + '&classid=' + params.classId
                + '&id=' + Math.random()
                + '&action=' + (params.action || 'search');

            $.ajax({
                type: 'POST',
                url: url,
                dataType: 'json',
                processData: false,
                contentType: 'application/json',
                data: JSON.stringify(params.data || {}),
                async: false,
                headers: { 'ajax': 'true' },
                success: function (data) {
                    result = data;
                },
                error: function (XMLHttpRequest) {
                    isError = true;
                    reason = JSON.parse(XMLHttpRequest.responseText).message;
                },
                complete: function () {
                    if (!params.noShowWaiting)
                        DecRequestCount();
                }
            });

            if (isError) {
                if (!params.noShowError)
                    swalApi.error(reason);

                throw new Error(reason);
            }

            return result;
        };

        var events = {};
        
        /**
         * 注册请求事件
         * @param params `{
         *     classId: 类ID（必须）
         *     action: 请求名（可选，不传值则所有请求都触发）
         *     success: 成功事件
         *     error: 失败事件
         *     $scope: 作用域，若传入了作用域，在作用域销毁时，解绑事件
         * }`
         */
        request.on = function (params) {
            var eventsOfClass = events[params.classId];

            if (!eventsOfClass) {
                eventsOfClass = {};
                events[params.classId] = eventsOfClass;
            }

            var action = params.action || '$all';

            var eventsOfAction = eventsOfClass[action];

            if (!eventsOfAction) {
                eventsOfAction = {
                    eventsOfSuccess: [],
                    eventsOfError: []
                };
                eventsOfClass[action] = eventsOfAction;
            }

            if (typeof params.success === 'function') {
                eventsOfAction.eventsOfSuccess.push(params.success);
            }

            if (typeof params.error === 'function') {
                eventsOfAction.eventsOfError.push(params.error);
            }

            //若注册事件时传入了作用域
            //在作用域销毁时，解绑事件
            if (params.$scope) {
                params.$scope.$on('$destroy', function () {
                    off();
                });
            }

            function off() {
                eventsOfAction.eventsOfSuccess.remove(params.success);
                eventsOfAction.eventsOfError.remove(params.error);
            }

            return off;
        };

        /**
         * 查询词汇的请求
         * @param {string} dictCode 词汇编码
         */
        request.getDict = function (dictCode) {
            return ['$cacheFactory', '$q', function ($cacheFactory, $q) {
                var cache = $cacheFactory('hcDict');
                var cacheOfDict = cache.get(dictCode);

                if (cacheOfDict === undefined) {
                    cacheOfDict = request({
                        classId: 'scpdict',
                        action: 'select',
                        data: {
                            dictcode: dictCode
                        }
                    })
                        .then(function (dictCategory) {
                            var dictItems = dictCategory.dict_items;

                            cache.put(dictCode, dictItems);

                            return dictItems;
                        });

                    cache.put(dictCode, cacheOfDict);
                }

                return $q.when(cacheOfDict).then(angular.copy);
            }].callByAngular();
        };

        /**
         * 查询对象配置的请求
         * @param {number|string} objTypeId 对象配置ID
         */
        request.getObjConf = function (objTypeId) {
            return ['$cacheFactory', '$q', function ($cacheFactory, $q) {
                var cache = $cacheFactory('hcObjConf');
                var cacheOfObjConf = cache.get(objTypeId);

                if (cacheOfObjConf === undefined) {
                    cacheOfObjConf = request({
                        classId: 'scpobjconf',
                        action: 'select',
                        data: {
                            objtypeid: objTypeId
                        }
                    })
                        .then(function (objConf) {
                            cache.put(objTypeId, objConf);
                            
                            objConf.obj_action_allowed = {};
                            objConf.obj_actions.forEach(function (obj_action) {
                                var value;

                                if (obj_action.allowed == 2) {
                                    value = true;
                                }
                                else if (obj_action.allowed == 1) {
                                    value = false;
                                }
                                else {
                                    value = null;
                                }

                                objConf.obj_action_allowed[obj_action.action] = value;
                            });

                            objConf.isAllowed = function (action) {
                                //admin 和管理员 允许任何动作
                                if (userbean.isAdmin || userbean.isAdmins) {
                                    return true;
                                }

                                return this.obj_action_allowed[action];
                            };

                            return objConf;
                        });

                    cache.put(objTypeId, cacheOfObjConf);
                }

                return $q.when(cacheOfObjConf).then(angular.copy);
            }].callByAngular();
        };

        /**
         * 查询系统参数
         * @param {string} paramCode 参数编码
         */
        request.getSysParam = function (paramCode) {
            return ['$cacheFactory', '$q', function ($cacheFactory, $q) {
                var cache = $cacheFactory('hcSysParam');
                var cacheOfSysParam = cache.get(paramCode);

                if (cacheOfSysParam === undefined) {
                    cacheOfSysParam = request
                        .post({
                            classId: 'sys_param',
                            action: 'select',
                            data: {
                                param_code: paramCode
                            }
                        })
                        .then(function (sysParam) {
                            cache.put(paramCode, sysParam);
                            return sysParam;
                        });

                    cache.put(paramCode, cacheOfSysParam);
                }

                return $q.when(cacheOfSysParam).then(angular.copy);
            }].callByAngular();
        };

        /**
         * 通用 HttpServlet 请求
         * @param params = {
         *     class: 类全名(若在 com.hczy 下，可省略 com.hczy)，此类必须实现接口 com.hczy.api.HttpApi$HttpHandler，且具有公有无参构造(不写构造就会拥有隐式的公有无参构造)
         *     data: 请求数据
         *     noShowError: 不显示错误
         *     noShowWaiting: 不显示等待
         * }
         */
        request.http = function (params) {
            var className = params.class;
            if (className.indexOf('com.') !== 0)
                className = 'com.hczy.' + className;

            if (!params.noShowWaiting)
                IncRequestCount('post');

            return $http({
                method: 'POST',
                url: 'http.jsp',
                data: params.data,
                params: {
                    // sessionId: strLoginGuid,
                    class: className
                }
            })
                .finally(function () {
                    if (!params.noShowWaiting)
                        DecRequestCount();
                })
                .then(
                    function (response) {
                        return response.data;
                    }, 
                    function (response) {
                        var responseDataHtml = $(response.data);
                        var reason = responseDataHtml.find('b:contains(message)+u').text()
                        responseDataHtml.remove();

                        if (!reason) {
                            response = response.data;
                        }

                        console.error('请求失败', reason, response);

                        if (params.noShowError)
                            return $q.reject(reason);

                        return swalApi.error(reason)
                            .then(function () {
                                return $q.reject(reason);
                            });
                    }
                );
        };

        /**
         * 获取指定文件ID的Excel数据
         */
        request.getExcelData = function (docId) {
            return request.http({
                class: 'impt.request.GetExcelData',
                data: {
                    docId: docId
                }
            });
        };

        return request;
    }].callByAngular();
});