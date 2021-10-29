define(['app'], function (app) {
/**
 * Main filter.js file
 * Define filters with data used in Inspinia theme
 *
 *
 * Functions (controllers)
 *  - Ellipsis //字符串长度控制
 */
function Ellipsis(){
	return function (value, wordwise, max, tail) {
	    if (!value) return '';

	    max = parseInt(max, 10);
	    if (!max) return value;
	    if (value.length <= max) return value;

	    value = value.substr(0, max);
	    if (wordwise) {
	      var lastspace = value.lastIndexOf(' ');
	      if (lastspace != -1) {
	        value = value.substr(0, lastspace);
	      }
	    }

	    return value + (tail || '…');
	  };
}

function Idadapter(){
	return function(input, param1) {
		var returnObj = [];
		 if(typeof input != "object" || param1 == undefined){
// console.log("匹配数组对象未设定");
			 return returnObj;
		 }
		 if(!input.length){
			 return returnObj;
		 }
		 var key = "id";
		 var stat = false;
		 if(typeof param1 == "object"){
			 stat = true;
			 for(var name in param1){// 取第一个属性
				 key = name;break;
			 }
		 }
	     for(var i = 0;i<input.length;i++){
	    	 var value = stat?param1[key]:param1;
	    	 if(value == input[i][key]){
    			 returnObj.push(input[i]);
    			 break;
    		 }
	     }
	     if(returnObj){
	    	  return returnObj;
	     }else
	    	 return returnObj;
	  };
}


function Trueorfalse(){
	return function (value,true_val,true_str,false_str) {
		if (value == undefined) return '';
		var trueStr = true_str || "True";
		var falseStr = false_str || "False";
		if(value == true_val){
			return trueStr;
			//return "\<a href='#'\>\<i class='fa fa-check text-navy'\>\</i\>\<\/a\>";
		}else{
			return falseStr;
		}
	};
}

/**
 *
 * Pass all functions into module
 */
/* angular
	.module('inspinia') */
app
    .filter('ellipsis', Ellipsis)
    .filter('idadapter', Idadapter)
	.filter('trueorfalse', Trueorfalse)
	;

});