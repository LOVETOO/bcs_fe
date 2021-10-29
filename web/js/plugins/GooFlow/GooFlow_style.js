var property={
	width:840,
	height:370,
	toolBtns:[
		// "start round mix",
		// "end round","task",
		"node","chat","state","plug","join","fork","complex mix"],
	haveHead:null,
	headLabel:false,
	headBtns:["new","open","save","undo","redo","reload"],//如果haveHead=true，则定义HEAD区的按钮
	haveTool:true,
	haveGroup:true,
	useOperStack:true
};
var remark={
	cursor:"选择指针",
	direct:"结点连线",
	// start:"入口结点",
	// "end":"结束结点",
	"task":"任务结点",
	node:"自动结点",
	chat:"决策结点",
	state:"状态结点",
	plug:"附加插件",
	fork:"分支结点",
	"join":"联合结点",
	"complex":"复合结点",
	group:"组织划分框编辑开关"
};
var demo;
$(document).ready(function(){
	demo=$.createGooFlow($("#FlowMod"),property);
	demo.setNodeRemarks(remark);
	demo.loadData(jsondata);
	//demo.reinitSize(1000,520);
});
var out;
function Export(){
	document.getElementById("result").value=JSON.stringify(demo.exportData());
	alert(demo.$lineOper.data("tid"));
}
GooFlow.prototype.color={
	main:"#1C84C6",
	font:"#fff",
	node:"#1c84c6",
	line:"#A5A5A5",
	lineFont:"#ed5565",
	mark:"#f8ac59",
	mix:"#1ab394",
	mixFont:"#777"
};