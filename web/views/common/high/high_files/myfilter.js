  var condtions="";
  var okSelect = []; //已经选择好的
  var okSelect_condtion = []; //已经选择好的

 
  
	// 界面初始化，根据字段类类型控制可以录入区域的数据
	function doInit(){
	
		   // 业务变量  
		   var FrmInfo={
				classid: 'drp_gcust_saleorder_header', //Search请求类
				type: 'checkbox', //单选或多选，默认''单选
				title: "常规订单查询",    //查询标题
				thead: [{
					name: "订单号",    //字段中文名
					code: "gsale_order_no", //字段名
					show: true,     //是否在查询结果列表中显示，默认是
					iscond: true,   //是否可作为条件，默认是
					type: 'string' //字段数据类型，默认字符串，如果是dict,则需要传入 词汇值列表：dicts:[{id:1,name:“”制单”},{id:2,name:"审核"]
				}, {
					name: "区域",
					code: "org_name",
					show: true,
					iscond: true,
					type: 'string'
				}, {
					name: "客户",
					code: "cust_name",
					show: true,
					iscond: true,
					type: 'string'
				},
                 {
					name: "订单日期",
					code: "order_date",
					show: true,
					iscond: true,
					type: "date"
				},
                 {
					name: "数量",
					code: "qty",
					show: true,
					iscond: true,
					type: 'number'
				},				
                 {
					name: "是否可用",
					code: "usable",
					show: true,
					iscond: true,
					type: 'boolean',
					dicts:[{id:1,name:"否"},{id:2,name:"是"}]
				},
               {
					name: "单据状态",
					code: "stat",
					show: true,
					iscond: true,
					type: 'list',
					dicts:[{id:2,name:"制单"},{id:2,name:"提交"},{id:3,name:"启动"},{id:5,name:"审核"}]
				},				
				],
				sqlBlock: "stat != 99 and sale_order_type=1 ", //强制性的过滤条件，默认空
				action: "search",   //查询方法，默认search
				postdata: {},       //查询时需要传值到后台时设置
				backdatas: "drp_gcust_saleorder_headers", //返回的结果集
			
			}
			
		
          // 数值、字符、日期		
		 function createConditionNumber(obj){
		 
		  var html='<div  class="tab-pane" id="'+obj.code+'"   style="height:100%;" > '
			+' <ul id="myTab_'+obj.code+'" class="nav nav-tabs myTab"  style="background:#cc99ff;"> '
			+'    <li class="active "> <a href="#condtion1_'+obj.code+'" data-toggle="tab">包括范围</a></li> '
			+'    <li class=""><a href="#condtion2_'+obj.code+'" data-toggle="tab">不包括范围</a></li> '
			+'    <li class=""><a href="#condtion3_'+obj.code+'" data-toggle="tab">包括值范围</a></li> '
			+'    <li class=""><a href="#condtion4_'+obj.code+'"data-toggle="tab">不包括值范围</a></li> '
			+' </ul> '
		    + ' <div id="myTabContent_'+obj.code+'" class="tab-content myTabContent" style="margin-left: 0px;height: 100%;"> '
			// 包括范围
            +'    <div class="tab-pane fade in active"  '
			+' 	   id="condtion1_'+obj.code+'"'
			+' 	   option_name="'+obj.name+'-包括范围"   '
			+' 	   option_filed="'+obj.code+'"    '
			+' 	   option_flag="1"   '
			+' 	   data_type="'+obj.type+'"   '
			+'    > '
			+'             <table class="gridtable" > '
			+' 				<thead> '
			+' 					<tr > '
			+' 					    <th class="seq">关系</th> '
			+' 						<th>开始值</th> '
			+' 						<th>结束值</th> '
			+' 						<th style="width:160px">操作</th> '
			+' 					</tr> '
			+' 				</thead> '
			+' 				<tbody > '
			+' 					<tr >	 '
			+' 					    <td  class="seq"></td> '
 			+' 					    <td> <input type="text"  class="input-sm form-control s_value " value="11"  ></td> '
 			+' 					    <td> <input type="text"  class="input-sm form-control e_value"  value="22"  ></td>	 '
			+' 						<td ><a href="#" class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>   '
			+' 						     <a href="#" class="add"   style="margin-left:15px;cursor:pointer">添加条件</a> '
			+' 					    </td> '
			+' 					</tr> '
			+' 				</tbody> '
			+' 			</table> '
			+' 	       <a href="#"><span class="j_add_line">增加一行</span></a> '
		    +'   </div> '
			// 不包括范围
			+'     <div class="tab-pane fade " id="condtion2_'+obj.code+'"'
			+' 	         option_name="'+obj.name+'-不包括范围" option_filed="'+obj.code+'"   option_flag="2" '
			+' 	   data_type="'+obj.type+'"   '
            +'  '
			+'      > '
			+'             <table class="gridtable" > '
			+' 				<thead> '
			+' 					<tr > '
			+' 					    <th class="seq">关系</th> '
			+' 						<th>开始值</th> '
			+' 						<th>结束值</th> '
			+' 						<th style="width:160px">操作</th> '
			+' 					</tr> '
			+' 				</thead> '
			+' 				<tbody > '
			+' 					<tr  >	 '
			+' 					    <td  class="seq"></td> '
 			+' 					    <td> <input type="text"  class="input-sm form-control s_value " value="1"  ></td> '
 			+' 					    <td> <input type="text"  class="input-sm form-control e_value"  value="3"  ></td>	'
			+' 						<td ><a href="#" class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>   '
			+' 						     <a href="#" class="add"   style="margin-left:15px;cursor:pointer">添加条件</a> '
			+' 					    </td> '
			+' 					</tr> '
			+' 				</tbody> '
			+' 			</table> '
			+' 	       <a href="#"><span class="j_add_line">增加一行</span></a> '
			+'    </div>'
			// 包括值范围
			+'    <div class="tab-pane fade" id="condtion3_'+obj.code+'"'
			+' 	         option_name="'+obj.name+'-包括值范围" option_filed="'+obj.code+'"  option_flag="3" '
			+' 	   data_type="'+obj.type+'"   '
			+'      > '
			+'             <table class="gridtable" > '
			+' 				<thead> '
			+' 					<tr >'
			+' 					    <th class="seq">关系</th> '
			+' 						<th>数值</th> '
			+' 						<th style="width:160px">操作</th> '
			+' 					</tr> '
			+' 				</thead> '
			+' 				<tbody > '
			+' 					<tr class="qty">	 '
			+' 					    <td  class="seq"></td> '
 			+' 					    <td> <input type="text"  class="input-sm form-control s_value " value="11"  ></td> '
			+' 						<td ><a href="#" class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>    '
			+' 					    	 <a href="#" class="add"   style="margin-left:15px;cursor:pointer">添加条件</a> '
			+' 					    </td> '
			+' 					</tr> '
            +'  '
			+' 				</tbody> '
			+' 			</table> '
			+' 	       <a href="#"><span class="j_add_line">增加一行</span></a> '
			+'    </div> '
			// 不包括值范围
			+'    <div class="tab-pane fade " id="condtion4_'+obj.code+'"'
			+' 	         option_name="'+obj.name+'-不包括值范围"  '
			+' 			 option_filed="'+obj.code+'"   '
			+' 			 option_flag="4" '
			+' 	   data_type="'+obj.type+'"   '
            +'             '
			+'      > '
			+'             <table class="gridtable" > '
			+' 				<thead> '
			+' 					<tr > '
			+' 					    <th class="seq">关系</th> '
			+' 						<th>数值</th> '
			+' 						<th style="width:160px">操作</th> '
			+' 					</tr> '
			+' 				</thead> '
			+' 				<tbody > '
			+' 					<tr class="qty">	 '
			+' 					    <td  class="seq"></td> '
 			+' 					    <td> <input type="text"  class="input-sm form-control s_value " value="22"  ></td> '
			+' 						<td ><a href="#" class="del"   onclick="claerTr(this);" style="cursor:pointer" >清空</a>     '
			+' 					  	     <a href="#" class="add"   style="mrgin-left:15px;cursor:pointer">添加条件</a> '
			+' 					    </td> '
			+' 					</tr> '
            +'  '
			+' 				</tbody> '
			+' 			</table> '
			+' 	       <a href="#"><span class="j_add_line">增加一行</span></a> '
			+'    </div>	  '
			+' </div> '
            +' </div> ';
         
		 return  html;
		 }
	    

         // 二选一型，采用checkbox 不允许多选		
	    function createConditionBoolean(obj,isMore){ 
		
		 
					
	   var html='<div  class="tab-pane" id="'+obj.code+'"   style="height:100%;" > '
			+' <ul id="myTab_'+obj.code+'" class="nav nav-tabs myTab"  style="background:#cc99ff;"> '
			+'    <li class="active "> <a href="#condtion1_'+obj.code+'" data-toggle="tab">单选项</a></li> '
			+'    <li class="" style="display:none" ><a href="#condtion2_'+obj.code+'" data-toggle="tab">不包括范围</a></li> '
			+'    <li class="" style="display:none"><a href="#condtion3_'+obj.code+'" data-toggle="tab">包括值范围</a></li> '
			+'    <li class="" style="display:none"><a href="#condtion4_'+obj.code+'"data-toggle="tab">不包括值范围</a></li> '
			+' </ul> '
		    + ' <div id="myTabContent_'+obj.code+'" class="tab-content myTabContent" style="margin-left: 0px;height: 100%;"> '
			// 包括范围
            +'    <div class="tab-pane fade in active"  '
			+' 	   id="condtion1_'+obj.code+'"'
			+' 	   option_name="'+obj.name+'-包括范围"   '
			+' 	   option_filed="'+obj.code+'"    '
			+' 	   option_flag="3"   '
			+' 	   data_type="number"   '
			+'    > '
			
		    +' <table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#FF7171"> '
					+'  <thead> '
					+'	  <tr >  '
					+'    <th><span   class="j_checkbox_val">数值</span></th> '
					+'	</tr> '
					+' </thead> '
					+'    <tbody> '
					+'    <tr> '
					+' 		<td  > '
					+'		<input   type="checkbox"  value="0"  class="j_checkbox_one"   /><span>不限</span></td> ' // 特定条件
					+'	  </tr> ';
					 
					  // 动态值
					for(var i=0;i<obj.dicts.length;i++){
						html=html+'<tr> '
								   +' 		<td  > '
								   +' 		<input   type="checkbox"    value="'+obj.dicts[i].id+'"  class="j_checkbox_one" /><span>'+obj.dicts[i].name+'</span></td> '
								   +' 	  </tr> '
								
					 }
				html+='	  </tbody> '
					+'  </table> '		
		    +'   </div> '
			// 不包括范围
			// 包括值范围
			// 不包括值范围
            +' </div> '
           +' </div> ';
		  return  html;
		 }

        // 多值选择，汇值列表,采用checkbox 允许多选
	     function createConditionList(obj){
		 
		   			
	   var html='<div  class="tab-pane" id="'+obj.code+'"   style="height:100%;" > '
			+' <ul id="myTab_'+obj.code+'" class="nav nav-tabs myTab"  style="background:#cc99ff;"> '
			+'    <li class="active "> <a href="#condtion1_'+obj.code+'" data-toggle="tab">多选项</a></li> '
			+'    <li class="" style="display:none" ><a href="#condtion2_'+obj.code+'" data-toggle="tab">不包括范围</a></li> '
			+'    <li class="" style="display:none"><a href="#condtion3_'+obj.code+'" data-toggle="tab">包括值范围</a></li> '
			+'    <li class="" style="display:none" ><a href="#condtion4_'+obj.code+'"data-toggle="tab">不包括值范围</a></li> '
			+' </ul> '
		    + ' <div id="myTabContent_'+obj.code+'" class="tab-content myTabContent" style="margin-left: 0px;height: 100%;"> '
			// 包括范围
            +'    <div class="tab-pane fade in active"  '
			+' 	   id="condtion1_'+obj.code+'"'
			+' 	   option_name="'+obj.name+'-包括范围"   '
			+' 	   option_filed="'+obj.code+'"    '
			+' 	   option_flag="3"   '
			+' 	   data_type="number"   '
			+'    > '
			
		    +' <table width="100%" border="0" cellpadding="0" cellspacing="1" bgcolor="#FF7171"> '
					+'  <thead> '
					+'	  <tr >  '
					+'    <th><span   class="j_checkbox_val">数值</span></th> '
					+'	</tr> '
					+' </thead> '
					+'    <tbody> '
					+'    <tr> '
					+' 		<td  > '
					+'		<input   type="checkbox"  value="0"  class="j_checkbox_more"   /><span>不限</span></td> ' // 特定条件
					+'	  </tr> ';
					 
					  // 动态值
					for(var i=0;i<obj.dicts.length;i++){
						html=html+'<tr> '
								   +' 		<td  > '
								   +' 		<input   type="checkbox"    value="'+obj.dicts[i].id+'"  class="j_checkbox_more" /><span>'+obj.dicts[i].name+'</span></td> '
								   +' 	  </tr> '
								
					 }
				html+='	  </tbody> '
					+'  </table> '		
		    +'   </div> '
			// 不包括范围
			// 包括值范围
			// 不包括值范围
            +' </div> '
           +' </div> ';
			 			
	 
				
		  return  html;		 
		    
			 
		 }	
		 
        	
	      // 列出条件字段-左边
		  var filed_list_html=""
		  for(var i=0;i<FrmInfo.thead.length;i++){
			   filed_list_html=filed_list_html+' <li class="" ><a href="#'+FrmInfo.thead[i].code+'" data-toggle="tab"><span class="filed" name="'+FrmInfo.thead[i].code+'"  op_type="'+FrmInfo.thead[i].type+'"   >'+FrmInfo.thead[i].name+'</span></a></li>';
		  }
		 // alert(filed_list_html);
		  $("#field_list").html(filed_list_html);

		  
		  // 列出条件字段--条件输入区-右边
		  var str="";
		  for(var i=0;i<FrmInfo.thead.length;i++){

		     // alert(FrmInfo.thead[i].name);
			  // 单选型
			   if (FrmInfo.thead[i].type=="boolean"){
			    str=str+createConditionBoolean(FrmInfo.thead[i]);
			   }
			   // 多选型
			   else if (FrmInfo.thead[i].type=="list"){ 
			     //createConditionList(FrmInfo.thead[i]);
				str=str+createConditionList(FrmInfo.thead[i]);
			   }
			  
			  // 字符、数字、日期 
			  else {
			      str=str+createConditionNumber(FrmInfo.thead[i]);
				}
		  }
		  
		   $("#tab-content").html(str);  
		   
	}
	
 // 删除SQL查询条件
  function   del(obj)  {  
	 obj.parentNode.parentNode.removeNode(true);  
	 $(this).parent().parent()
 }     

function addStr(obj_name, obj_text,option_filed,obj_val,option_flag,data_type) { //增加数组给定相同的字符串
	//  alert(obj_name+" ==="+obj_val);
      okSelect.push(obj_name + '|' + obj_text); 
      okSelect_condtion.push(option_filed + '|' + obj_val+"|"+option_flag+"|"+data_type); 
 
};


 //删除数组给定相同的字符串
function removeStr(obj_name) {
      //okSelect.push(obj_name + '|' + obj_text); 
      //okSelect_condtion.push(obj_name + '|' + obj_val); 
    var n = -1;
    for (var i = 0,len = okSelect.length; i < len; i++) {
		var str_name=okSelect[i].split("|");
        //	alert(obj_name+':: '+str_name[0]);
        if (obj_name == str_name[0]) {
            n = i;
            break;
        }
    }

    n > -1 && okSelect.splice(n, 1);
    n > -1 && okSelect_condtion.splice(n,1);
 
};

 //删除数组给定相同的字符串
function delStr(str, arr) {
    var n = -1;
    for (var i = 0,
    len = arr.length; i < len; i++) {
        if (str == arr[i]) {
            n = i;
            break;
        }
    }
    n > -1 && arr.splice(n, 1);
};

 //删除数组给定相同的字符串
function delStrNew(obj_name, arr) {

   var n = -1;
  //  alert('arr:'+arr);
    for (var i = 0,len = arr.length; i < len; i++) {
		var str_name=arr[i].split("|");
       // alert(obj_name+':: '+str_name[0])+' :'+arr[i];
        if (obj_name == str_name[0]) {
            n = i;
            break;
        }
    }

    n > -1 && arr.splice(n, 1);
    
};


  // 删除当前条件行
 function deleteTr(nowTr){
  //  alert('11111');
	$(nowTr).parent().parent().remove();
} 
 // 清除当行值
 function claerTr(nowTr){
	        $(nowTr).parent().parent().find(".s_value").val('') ;
			$(nowTr).parent().parent().find(".e_value").val('') ;
} 



  $().ready(function() {
  
    // 实始化界面字段 
	doInit();
 
	// 添加动态条件
	$("body").on("click",".add",function(){
        
		//var namegroups = new Array();
		var vals = new Array();
		var texts = new Array();
        var obj_id= $(this).parent().parent().parent().parent().parent().attr("option_id") 
		var obj_name= $(this).parent().parent().parent().parent().parent().attr("option_name") 
		var option_filed=$(this).parent().parent().parent().parent().parent().attr("option_filed") ;

		// =1 包括范围 >= ;=2 不包括范围 ;=3 包括值范围  in ; =4 不包括值范围  ; 
    	var option_flag=$(this).parent().parent().parent().parent().parent().attr("option_flag") ;
        var data_type=$(this).parent().parent().parent().parent().parent().attr("data_type") ;	 
 
 		// var s_value=$(this).parent().parent().find(".s_value").val();
		// var e_value=$(this).parent().parent().find(".e_value").val();
		// if (s_value==""||s_value==null)
		//	 alert("数值不能为空");


		 

         var namegroups= $(this).parent().parent().parent().children("tr");
         //alert(" ==children_row::"+namegroups.length);

        // 先清空已选定的条件临时记录
         removeStr(obj_name);
		
		 // 同组条件，每行值范围用#隔开	  
		 for(g = 0 ;g < namegroups.length ; g++){
				 s_value=$(namegroups[g]).find(".s_value").val();
				 e_value=$(namegroups[g]).find(".e_value").val();

				 if (s_value==""||s_value==null){
					 alert("第"+(g+1)+"行条件不能为空");
					 return false;
				  }

				 var row_valuegroups=s_value;
				 if (e_value!=null)
				 {
                  // alert("e_value::no");
				    row_valuegroups=s_value+"#"+e_value;
				 } 
				// var row_valuegroups=s_value+"#"+e_value;
				 vals[g] = row_valuegroups ;
				 texts[g] = row_valuegroups; 
          }
           //alert('vals:'+vals);
          addStr(obj_name,texts,option_filed,vals,option_flag,data_type);
		   // 显示选中的条件
	       showcondtion();
	 });
	 
     // 删除条件
	$("body").on("click",".del",function(){
      

		var obj=$(this).parent().parent().parent().parent().parent();
        var obj_id= obj.attr("option_id") 
		var obj_name=obj.attr("option_name") 
		var option_filed=obj.attr("option_filed") ;
     	var option_flag=obj.attr("option_flag") ;
        var data_type=obj.attr("data_type") ;	 
	 
	  // 先清空已选定的条件临时记录
       
		// alert(" ==obj_name::"+option_filed);
		// removeStr(option_filed);
		 delStrNew(obj_name,okSelect);
		 delStrNew(option_filed,okSelect_condtion);
	 
	
	     var namegroups= obj.find("."+option_filed);
		 if (namegroups.length>1){
             $(this).parent().parent().remove();
			 var add= obj.find(".add:last");
		     add.click();
		 }else {
		    $(this).parent().parent().find(".s_value").val("");
			$(this).parent().parent().find(".e_value").val("");
	
		 }  
	     showcondtion();   
	 });
  
   // 增加条件空行
 	$('.j_add_line').click(function(){

     // 条件类型-不值范围或值范围
     var option_flag=$(this).parent().parent().attr('option_flag');
     //alert('option_flag:'+option_flag);

	 var _this=$(this).parent().parent().find('table tbody tr:last');
     var html=' <tr >'	
	      	if (option_flag==1||option_flag==3)
	 	        html=html+'    <td  class="seq">或者</td>';
			else 
			   html=html+'    <td  class="seq">并且</td>';
 	 	    html=html+'     <td> <input type="text"  class="input-sm form-control s_value"  value=""  ></td>';
			if (option_flag<3)
			{
				  html=html+'	   <td> <input type="text"  class="input-sm form-control e_value"  value=""  ></td>	'
			}
	 	    html=html+'	   <td ><a href="#" class="del" onclick="deleteTr(this);" style="cursor:pointer" >删除条件</a> '
	 		+'	                <a href="#" class="add"  style="margin-left:15px;cursor:pointer ">添加条件</a>'
	 		+'		</td>'
    		+' </tr>';

        _this.after(html);
	});
 	 //  单选项
	$("body").on("click",".j_checkbox_one",function(){
	//var namegroups = new Array();
		var vals = new Array();
		var texts = new Array();
		var obj= $(this).parent().parent().parent().parent().parent();
        var obj_id= obj.attr("option_id") 
		var obj_name= obj.attr("option_name") 
		var option_filed=obj.attr("option_filed");
		// =1 包括范围 >= ;=2 不包括范围 ;=3 包括值范围  in ; =4 不包括值范围  ; 
    	var option_flag=obj.attr("option_flag") ;
        var data_type=obj.attr("data_type") ;	 
 		var obj_val=$(this).val();
		var obj_text=$(this).parent().find("span").html();
 
	    //alert("obj_name:"+obj_name+' ='+obj_val+' :'+obj_text);
		// 查找同个字段下的选项
	    var namegroups= obj.find(".j_checkbox_one");
		var j_checkbox_val=obj.find(".j_checkbox_val");
		 //alert("j_checkbox_val:"+j_checkbox_val.html());
		 
		// 删除条件
		removeStr(obj_name);
		j_checkbox_val.html('未选');

		// 增加条件
		for(var g = 0 ;g < namegroups.length ; g++){
			     if (obj_val==namegroups[g].value){
				   if (namegroups[g].checked) {   
                       addStr(obj_name,obj_text,option_filed,obj_val,option_flag,data_type);
					   j_checkbox_val.html(obj_text);
					}
				 }else {
				   namegroups[g].checked=false;
			    } 
		}
	    // 显示条件
    	showcondtion(); 
 
	});
 
    // 多选项
   $("body").on("click",".j_checkbox_more",function(){
	//var namegroups = new Array();
		var vals = new Array();
		var texts = new Array();
		var obj= $(this).parent().parent().parent().parent().parent();
        var obj_id= obj.attr("option_id") 
		var obj_name= obj.attr("option_name") 
		var option_filed=obj.attr("option_filed");
		// =1 包括范围 >= ;=2 不包括范围 ;=3 包括值范围  in ; =4 不包括值范围  ; 
    	var option_flag=obj.attr("option_flag") ;
        var data_type=obj.attr("data_type") ;	 
 		//var obj_val=$(this).val();
		//var obj_text=$(this).parent().find("span").html();
 
	   // alert("obj_name:"+obj_name+' ='+obj_val+' :'+obj_text);
		// 查找同个字段下的选项
	    var namegroups= obj.find(".j_checkbox_more");
		var j_checkbox_val=obj.find(".j_checkbox_val");
		 //alert("j_checkbox_val:"+j_checkbox_val.html());
		 
		// 删除条件
		removeStr(obj_name);
		j_checkbox_val.html('未选');

		// 增加条件
	    var vals = new Array();
		var texts = new Array();
		var valindex=0;
		for(var g = 0 ;g < namegroups.length ; g++){
				var  obj_text=$(namegroups[g]).parent().find("span").html();
			    var  obj_val=$(namegroups[g]).attr("value");	
				if(namegroups[g].checked){
					texts[valindex] =  obj_text ; 
					vals[valindex] =  obj_val  ;
					valindex++;
				}
		 }

		if (vals.length>0)  {
		    addStr(obj_name,texts,option_filed,vals,option_flag,data_type);
			j_checkbox_val.html(vals.join(","));
		}  
			  
	    // 显示条件
    	showcondtion(); 
 
	});
 
  
 
	//  清空
	$("body").on("click",".eliminateCriteria",function(){
       $(".clearList").html(''); 
 	   $("#sql1").html('');
	   $("#mysql").val('');
	   okSelect = []; //已经选择好的
       okSelect_condtion = []; //已经选择好的
    });

	
	// 得到SQL,执行查询
	$("body").on("click",".confirm",function(){
        // 返回给调用端
		var sql=$("#mysql").val() 	 
		alert('执行查询\r\n'+sql);
    });
	
});


 

    // 显示选中的条件
 function showcondtion(){

       // =1 包括范围 
	   function getSql1(filedname,values,data_type){
		    // alert('getSql1:'+data_type);
	         var sql1="";
            for (var j = 0,size1 = values.length; j < size1; j++) {
			//	  alert(value[j]);
				var groupvalue=values[j].split('#');
				var pos= values[j].indexOf("#");
				var s_value=groupvalue[0];
				var e_value=groupvalue[1];
			 
				
				if (data_type=="string"){
				   s_value="'"+s_value+"'";
				   e_value="'"+e_value+"'";
				}
			    else if (data_type=="date"){
				    s_value=" to_date('"+s_value+"','yyyy-mm-dd') ";
				    e_value=" to_date('"+e_value+"','yyyy-mm-dd') ";
				}	
				
			
				// alert("groupvalue--:"+groupvalue.length+"  ==="+pos);
				// 条件组合
				  if (j==0) {
					//if (pos!=-1){
                           sql1="("+filedname+">="+s_value +" and "+filedname+"<="+e_value+")" ;
					//}else
					//   sql1=filedname+"="+value; 
				  }else {
					//if (pos!=-1){
                           sql1=sql1+" or ("+filedname+">="+s_value+" and "+filedname+"<="+e_value+")" ;
					//}else
					//    sql1=sql1+" and "+filedname+"="+value;  
				 }
			 } 
         return  sql1;
	   }

       // =2 不包括范围 
	   function getSql2(filedname,values,data_type){
		 //  alert('getSql');
		    var sql1="";
            for (var j = 0,size1 = values.length; j < size1; j++) {
				// alert(value[j]);
				var groupvalue=values[j].split('#');
				var pos= values[j].indexOf("#");
				var s_value=groupvalue[0];
				var e_value=groupvalue[1];
				
				if (data_type=="string"){
				   s_value="'"+s_value+"'";
				   e_value="'"+e_value+"'";
				}
			    else if (data_type=="date"){
				    s_value=" to_date('"+s_value+"','yyyy-mm-dd') ";
				    e_value=" to_date('"+e_value+"','yyyy-mm-dd') ";

				}	
				
			
				//alert("groupvalue--:"+groupvalue.length+"  ==="+pos);
				// 条件组合
				  if (j==0) {
					//if (pos!=-1){
                           sql1="("+filedname+">="+s_value +" and "+filedname+"<="+e_value+")" ;
					//}else
					//   sql1=filedname+"="+value; 
				  }else {
					//if (pos!=-1){
                           sql1=sql1+" and ("+filedname+">="+s_value+" and "+filedname+"<="+e_value+")" ;
					//}else
					 //   sql1=sql1+" and "+filedname+"="+value;  
				 }
			 } 
			 sql1=" not ("+sql1+")";
         return sql1; 
	   }



       // =3  包括值范围  ; 
       function getSql3(filedname,values,data_type){

	       // alert("::"+values.length);			
		    var sql="";
			if (data_type=="number"){
			     //0 值时表示所有，排除这个字段
			    if (values.indexOf("0")==-1){
			          sql=filedname+"  in ("+values+") ";
				   }
			}
			else {
				for (var j = 0,size1 = values.length; j < size1; j++) {
					var value=values[j];
					
					if (data_type=="string"){
					  value="'"+value+"'";
					}
					else if (data_type=="date"){
						value=" to_date('"+value+"','yyyy-mm-dd') ";
					}	

					// 条件组合
					  if (j==0) {
						  sql=filedname+"="+value; 
					  }else {
						 sql=sql+" or  "+filedname+"="+value;  
					 }
				 } 
			}	
		 
		   return sql;
	   }

       // =4 不包括值范围  ; 
       function getSql4(filedname,values,data_type){
		   var sql="";
			if (data_type=="number"){
			    sql=filedname+"  in ("+values+") ";
			}
			else {
				for (var j = 0,size1 = values.length; j < size1; j++) {
					var value=values[j];
					
					if (data_type=="string"){
					  value="'"+value+"'";
					}
					else if (data_type=="date"){
						value=" to_date('"+value+"','yyyy-mm-dd') ";
					}	

					// 条件组合
					  if (j==0) {
						  sql=filedname+"="+value; 
					  }else {
						 sql=sql+" and   "+filedname+"="+value;  
					 }
				 } 
			}	
		   sql=" not ("+sql+")"
		   return sql;
	   }


	    var oClearList = $(".hasBeenSelected .clearList"); 
	   // alert(':'+okSelect.length);
		var infor="",sql="";
		var texts = [],vals=[];
		for (var i = 0,size = okSelect.length; i < size; i++) {
			texts = okSelect[i].split('|');
			infor += '<div class=\"selectedInfor selectedShow\"><span>' + texts[0] + '</span>：<label>' + texts[1] + '</label><em></em></div>';
		}


        // 显示中文条件
		oClearList.html(infor); 
        $('#sql1').html(okSelect_condtion);


		for (var i = 0,size = okSelect_condtion.length; i < size; i++) {
			vals = okSelect_condtion[i].split('|');
			var value=vals[1].split(',');
			var filedname=vals[0];
			var flag=vals[2]; // 动作
			var data_type=vals[3];// 类型

			var sql1="";
		  //  alert(flag+"==="+value);

			switch(parseInt(flag)){
			  
			  case 1:  // 包括范围
                 sql1=getSql1(filedname,value,data_type);
			  break;

			  case 2: // 不包括范围
				   sql1=getSql2(filedname,value,data_type);
			  break;

			  case 3: // 包括值范围
				  sql1=getSql3(filedname,value,data_type);
			  break;

			  case 4: //不包括值范围
				  sql1=getSql4(filedname,value,data_type);
			  break;


			}

           // 单个条件完成
		   if (sql1!=""){
		    sql1="("+sql1+")";
            if (i==0) {
					   sql=sql1; 
				  }else {
					    sql=sql+" and "+sql1;
				 }
			}
		}
         // 显示sql执行条件
		//$('#sql').html(sql);
		$('#mysql').val(sql);
		$('#mysql').change();
   }
