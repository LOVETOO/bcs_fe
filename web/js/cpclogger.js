Logger = {version: '1.0'};
var LogSettions = new Array(true,true,true,true);
var logConsole = null;
var isLogConsoleShow = false;
var oldKeyEvent = null;
var logs = "";

Logger.info = function(str)
{
	if(!LogSettions[0]) return;
	Logger.log(str);
};

Logger.debug = function(str)
{
	if(!LogSettions[1]) return;
	Logger.log(str);
};

Logger.warning = function(str)
{
	if(!LogSettions[2]) return;
	Logger.log(str);
};

Logger.error = function(str)
{
	if(!LogSettions[3]) return;
	Logger.log(str);
};

Logger.log = function(str)
{
	if(!str) return;
	if(typeof(str) == "object")
	{
		// 数组
		var i = null;
		for(i in str)
		{
			logs += (i+",");
		}
	}
	else
		logs += str;
	logs += "\r\n";
	if(isLogConsoleShow)
	{
		var text = document.getElementById("console_logs");
		text.value += logs;
		logs = "";
	}
};

Logger.showLogs = function()
{
	if(isLogConsoleShow) return;
	if(!logConsole)
		createConsole();
	else
	{
		logConsole.style.top = document.body.scrollTop+document.body.clientHeight-200;
		logConsole.style.display = "";
	}
	var text = document.getElementById("console_logs");
	text.value += logs;
	logs = "";
	isLogConsoleShow = true;
};

Logger.hideLogs = function()
{
	if(logConsole) logConsole.style.display = "none";
	isLogConsoleShow = false;
};

Logger.clearLogs = function()
{
	if(logConsole)
	{
		var text = document.getElementById("console_logs");
		text.value = "";
	}
};

Logger.captureKey = function()
{
	var oldKeyEvent = document.onkeydown;
	document.onkeydown = function(event)
	{
		event = event || window.event;
		if(event.altKey && 48 == (event.which||event.keyCode))
		{
			// ALT + 0(零)
			Logger.showLogs();
		}
		if(oldKeyEvent) oldKeyEvent(event);
	}
};

function createConsole()
{
	logConsole = document.createElement("<div>");
	logConsole.id = "scplogconsole";
	logConsole.style.display = "block";
	logConsole.style.position = "absolute";
	logConsole.style.zindex = 1;
	logConsole.style.width = document.body.clientWidth-5;
	logConsole.style.height = 200;
	logConsole.style.left = 0;
	logConsole.style.top = document.body.scrollTop+document.body.clientHeight-205;
	logConsole.style.border = "1px solid #ADC9EC";
	var str = "<table width='100%' style='background: #F2F7FC;'><tr><td width='50%'>日志：</td>";
	str += "<td width='50%' align='right'><input type='button' id='console_clear' value='Clear' onclick='Logger.clearLogs();'>";
	str += "&nbsp;&nbsp;<input type='button' id='console_close' value='Close' onclick='Logger.hideLogs();'></td></tr>";
	str +="<tr><td colspan=2><textarea id='console_logs' style='width:100%;height:170;'></textarea></td></tr></table>";
	logConsole.innerHTML = str;
	document.body.appendChild(logConsole);
}

// 设置热键
Logger.captureKey();
