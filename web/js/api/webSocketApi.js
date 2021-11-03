/**
 * WebSocket 消息服务Api
 * @since 2019-06-17
 */
define(['swalApi'],function (swalApi) {
	if (window !== top) {
		//所有窗口共用 WebSocket
		return top.require('webSocketApi');
	}

	var api = {},
		webSocket = null,							//WebSocket 实例
		nextMessageHandlerId = 1,					//下一个消息处理器ID
		messageHandlers = Object.create(null),		//消息处理器集合
		messageHandlerCount = 0,					//消息处理器数量
		isCloseProactively = false,					//是否主动关闭连接
		isReconnect = false;						//是否重新连接
		isconnect = false;							//是否处于连接状态

	/**
	 * 创建 WebSocket
	 */
	function createWebSocket(sessionId) {
		webSocket = new WebSocket('ws://' + location.host + '/websocket/connect/' + sessionId);

		webSocket.onopen = function onWebSocketOpen() {
			isconnect = true;
			console[isReconnect ? 'info' : 'debug']('WebSocket 连接成功');
		};

		/**
		 * 连接关闭事件
		 */
		webSocket.onclose = function onWebSocketClose(event) {
			isconnect = false;
			console[isCloseProactively ? 'debug' : 'warn']('WebSocket 连接关闭', event);

			if (isCloseProactively) return;

			//若不是主动关闭连接，隔一段时间后重连

			isReconnect = true;

			setTimeout(function () {
				console.warn('WebSocket 正在重新连接');
                var sId = getCookie && getCookie('syssessionid');
				sId && createWebSocket(sId);
			}, 1 * 60 * 1000); //1分钟后重连
		};

		/**
		 * 连接错误事件
		 */
		webSocket.onerror = function onWebSocketError(event) {
			isconnect = false;
			console.error('WebSocket 连接错误', event);
		};

		/**
		 * 消息事件
		 */
		webSocket.onmessage = function onWebSocketMessage(event) {
			if (!messageHandlerCount) return;

			var data = JSON.parse(event.data);

			Object.keys(messageHandlers).forEach(function (id) {
				var messageHandler = messageHandlers[id];

				setTimeout(function () {
					messageHandler(data);
				});
			});
		};
	}

	require(['jquery'], function ($) {
		//判断当前浏览器是否支持WebSocket
		if (window.WebSocket) {
			var intervalId = setInterval(function () {
                var sessionId = getCookie && getCookie('syssessionid');
                if (!sessionId) {
                    return;
                }
                clearInterval(intervalId);
                createWebSocket(sessionId);
            }, 100);
		}
		else {
			console.error('当前浏览器不支持 WebSocket');
		}

		/**
		 * 关闭窗口前关闭连接
		 */
		$(window).on('beforeunload', function () {
			if (!webSocket) return;

			isCloseProactively = true;

			//关闭窗口前关闭连接
			webSocket.close();

			webSocket = null;
		});
	});

	/**
	 * 注册消息事件
	 */
	api.on = function (messageHandler) {
		var id = nextMessageHandlerId++;

		var messageHandlerController = {
			id: id,
			destroy: function () {
				if (id in messageHandlers) {
					delete messageHandlers[id];
					messageHandlerCount--;
				}
			}
		};

		if (typeof messageHandler === 'function') {
			messageHandlers[messageHandlerController.id] = messageHandler;
			messageHandlerCount++;
		}
		else {
			console.error('消息处理器必须是一个函数');
		}

		return messageHandlerController;
	};

	api.send = function (msg) {
		return new Promise(function(resolve,reject) {
			if(!isconnect){
				resolve('e');
			}else{
				webSocket.send(JSON.stringify(msg));
				resolve(msg);
			}
		})
		
	}
	return api;
});