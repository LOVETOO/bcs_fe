
function get_control(id) 
{
	return document.getElementById(id);
}


/****************************************************
 * 清空输入
 */
function CPCClearInput(id)
{
	var input = get_control(id);
	if(input) input.value = "";
}

/****************************************************
 * 清空输入
 */
function CPCClearInput2(id1,id2)
{
	var input = get_control(id1);
	if(input) input.value = "";
	input = get_control(id2);
	if(input) input.value = "";
}

/****************************************************
 * 显示选择框
 */
function CPCShowSearch(event,search,fieldName,url)
{
	if(!url) url = "/web/scp/scpsearch.jsp";
	var retValue = window.showModalDialog(url+"?search="+search,"","dialogWidth:600px;dialogHeight:500px;center:yes");
	if(!retValue) return;
	var input = get_control(fieldName);
	if(input) input.value = retValue;
}

/****************************************************
 * 显示选择框，选择数据支持ID与名称
 */
function CPCShowSearch2(event,search,fieldName,fieldId,url)
{
	if(!url) url = "/web/scp/scpsearch.jsp";
	var retValue = window.showModalDialog(url+"?search="+search,"","dialogWidth:600px;dialogHeight:500px;center:yes");
	if(!retValue) return;

	//分解出ID与NAME
	var idx = retValue.indexOf("|");
	var id = retValue;
	var name = "";
	if(idx>0)
	{
		id = retValue.substring(0,idx);
		if(idx<retValue.length-1) name = retValue.substring(idx+1);
	}
	
	var input = get_control(fieldId);
	if(input) input.value = retValue.substring(0,idx);
	input = get_control(fieldName);
	if(input) input.value = name;
}

/****************************************************
 * 显示选择框返回选择数据
 */
function CPCGetSearch(event,search,url)
{
	if(!url) url = "/web/scp/scpsearch.jsp";
	var retValue = window.showModalDialog(url+"?search="+search,"","dialogWidth:600px;dialogHeight:500px;center:yes");
	if(!retValue) return;
	return retValue;
}


/****************************************************
 * spin控件点击调整数值
 */
function CPCSpinClick(id,offset,limit)
{
	var input = get_control(id);
	if(input)
	{
		if(0.1 == Math.abs(offset))
		{
			var v = parseFloat(input.value);
			if(offset>0 && limit<v+offset) return;
			if(offset<0 && limit>v+offset) return;
			input.value = (10*v + 10*parseFloat(offset))/10;
		}
		else
		{
			var v = parseFloat(input.value);
			if(offset>0 && limit<v+offset) return;
			if(offset<0 && limit>v+offset) return;
			input.value = v + parseFloat(offset);
		}
	}
}

/****************************************************
 * 检查输入数值
 */
function CPCCheckNumber(input)
{
	var value = input.value;
	if(value.length>0 && !isNaN(value))
	{
		MessageBox(value+" 不是有效数值！");
		input.focus();
	}
}

/****************************************************
 * 检查输入数值，校验数值范围
 */
function CPCCheckNumber2(input,min,max)
{
	var value = input.value;
	if(value.length<1) return;
	if(isNaN(value))
	{
		MessageBox(value+" 不是有效数值！");
		input.focus();
		return;
	}
	var v = parseFloat(value);
	if(value<min)
	{
		MessageBox(value + " 超出最小值："+min);
		input.focus();
		return;
	}
	if(value>max)
	{
		MessageBox(value + " 超出最大值："+max);
		input.focus();
		return;
	}
}

/****************************************************
 * 按钮处理
 * CPCDivButtonContext	按钮状态调整
 * CPCButtonIsEnable	判断按钮是否可用
 * CPCEnableButton		启用/禁用按钮
 * CPCShowButton		显示/隐藏按钮
 */
function CPCDivButtonContext(obj, state) 
{
	if(state == 'mouseover') 
	{
		obj.style.cursor = 'pointer';
		var mode = obj.state ? 'down' : 'hover';
		if(obj.mode != mode) 
		{
			obj.mode = mode;
			obj.className = 'divbutton' + mode;
		}
	} 
	else
	{
		var mode = obj.state ? 'selected' : 'normal';
		if(obj.mode != mode) 
		{
			obj.mode = mode;
			obj.className = mode == 'selected' ? 'divbuttonselected' : 'divbuttonnormal';
		}
	}
}
function CPCButtonIsEnable(btn)
{
	if(!btn) return true;
	if(btn.tagName.toLowerCase() == "div")
		return !btn.getAttribute("disabled");
	return !btn.disabled;
}

var ButtonDisabledOnClicks = new Array();
var ButtonDisabledOnMouseouts = new Array();
var ButtonDisabledOnMouseovers = new Array();
function CPCEnableButton(id, enable)
{
	var btn = get_control(id);
	if(!btn) return;
	var strTagName = btn.tagName.toLowerCase();
	if(strTagName == "div" || strTagName == "a")
	{
		btn.setAttribute("disabled",!enable);
		if(enable)
		{
			//还原onclick处理
			if(!btn.onclick && ButtonDisabledOnClicks[id])
			{
				btn.onclick = ButtonDisabledOnClicks[id];
				ButtonDisabledOnClicks[id] = null;
			}
			if(!btn.onmouseout && ButtonDisabledOnMouseouts[id])
			{
				btn.onmouseout = ButtonDisabledOnMouseouts[id];
				ButtonDisabledOnMouseouts[id] = null;
			}
			if(!btn.onmouseover && ButtonDisabledOnMouseovers[id])
			{
				btn.onmouseover = ButtonDisabledOnMouseovers[id];
				ButtonDisabledOnMouseovers[id] = null;
			}
		}
		else
		{
			//去除onclick、onmouseout、onmouseover处理
			if(btn.onclick)
			{
				ButtonDisabledOnClicks[id] = btn.onclick;
				btn.onclick = null;
			}
			if(btn.onmouseout)
			{
				ButtonDisabledOnMouseouts[id] = btn.onmouseout;
				btn.onmouseout = null;
			}
			if(btn.onmouseover)
			{
				ButtonDisabledOnMouseovers[id] = btn.onmouseover;
				btn.onmouseover = null;
			}
		}
	}
	else if(strTagName == "input" || strTagName == "a")
		btn.disabled = !enable;
	else if(strTagName == "table")
	{
		//设置工具栏所有按钮
		var cells = btn.rows[0].cells;
		if(!cells) return;
		for(var i=0;i<cells.length;i++)
		{
			var item = cells[i].firstChild;
			if(item && item.id) CPCEnableButton(item.id, enable);
		}
	}
}

function CPCEnableButton1(id, enable)
{
	var btn = get_control(id);
	if(!btn) return;

	var strTagName = btn.tagName.toLowerCase();
	if(strTagName == "div" || strTagName == "a")
	{
		btn.setAttribute("disabled",!enable);
		if(enable)
		{
			btn.style.display = "";
			//还原onclick处理
			if(!btn.onclick && ButtonDisabledOnClicks[id])
			{
				btn.onclick = ButtonDisabledOnClicks[id];
				ButtonDisabledOnClicks[id] = null;
			}
			if(!btn.onmouseout && ButtonDisabledOnMouseouts[id])
			{
				btn.onmouseout = ButtonDisabledOnMouseouts[id];
				ButtonDisabledOnMouseouts[id] = null;
			}
			if(!btn.onmouseover && ButtonDisabledOnMouseovers[id])
			{
				btn.onmouseover = ButtonDisabledOnMouseovers[id];
				ButtonDisabledOnMouseovers[id] = null;
			}
		}
		else
		{
			btn.style.display = "none";
			//去除onclick、onmouseout、onmouseover处理			
			if(btn.onclick)
			{
				ButtonDisabledOnClicks[id] = btn.onclick;
				btn.onclick = null;
			}
			if(btn.onmouseout)
			{
				ButtonDisabledOnMouseouts[id] = btn.onmouseout;
				btn.onmouseout = null;
			}
			if(btn.onmouseover)
			{
				ButtonDisabledOnMouseovers[id] = btn.onmouseover;
				btn.onmouseover = null;
			}
		}
	}
	else if(strTagName == "input" || strTagName == "a"){
		btn.disabled = !enable;
		if(enable){
			btn.style.display = "";
		}else{
			btn.style.display = "none";
			
		}
		
	}

	else if(strTagName == "table")
	{
		//设置工具栏所有按钮
		var cells = btn.rows[0].cells;
		if(!cells) return;
		for(var i=0;i<cells.length;i++)
		{
			var item = cells[i].firstChild;
			if(item && item.id) CPCEnableButton1(item.id, enable);
		}
	}
}

//将文本框设置成只读属性
function CPCShowTxt(id, visiable)
{
	if(null == visiable || isUndefined(visiable))
		visiable = true;
	var txt = get_control(id);

		if(visiable)
			txt.style.display = "";
		else
			txt.style.display = "none";
	
}

function CPCShowButton(id, visiable)
{
	if(null == visiable || isUndefined(visiable))
		visiable = true;
	var btn = get_control(id);
	if(btn.tagName.toLowerCase() == "div")
	{
		if(visiable)
			btn.style.display = "";
		else
			btn.style.display = "none";
	}
}

function CPCShowButton(id, visiable)
{
	if(null == visiable || isUndefined(visiable))
		visiable = true;
	var btn = get_control(id);
	if(btn.tagName.toLowerCase() == "div")
	{
		if(visiable)
			btn.style.display = "";
		else
			btn.style.display = "none";
	}
}

/****************************************************
 * listbox处理
 * CPCListBoxAddItems	增加选项
 * CPCListBoxAddFromDataRelation 根据关联对象增加选项
 * CPCListBoxClear 		清空选项
 */
function CPCListBoxAddItems(formId,ctrlId,text)
{
	if(!text) return;
	var items = text.split(";");
	var list = get_control(formId).elements[ctrlId];
	for (var i=0;i<items.length;i++)
	{
		var strs = items[i].split("|");
		var o = document.createElement("OPTION");
		if(2 == strs.length)
		{
			o.value = strs[0];
			o.text = strs[1];
		}
		else
		{
			o.value = strs[0];
			o.text = strs[0];
		}
		if(IsMSIE)
			list.add(o);
		else
			list.appendChild(o);
	}
}

function CPCListBoxAddFromDataRelation(formId,ctrlId,dr,valueField,nameField)
{
	if(!dr || dr.isNull()) return;
	var list = get_control(formId).elements[ctrlId];
	var items = dr.getData();
	for (var i=0;i<items.length;i++)
	{
		var o = document.createElement("OPTION");
		o.value = items[i][valueField];
		o.text = items[i][nameField];
		if(IsMSIE)
			list.add(o);
		else
			list.appendChild(o);
	}
}

function CPCListBoxSelectItem(formId,ctrlId,idx)
{
	var list = get_control(formId).elements[ctrlId];
	list.value = list.options[idx].value;
}

function CPCListBoxClear(ctrlId, formId)
{
	var list = null;
	if(formId)
		list = get_control(formId).elements[ctrlId];
	else
		list = get_control(ctrlId);
	list.value = null;
	while (list.options.length > 0)
	{
		list.options[0] = null;
	}
}

function CPCGetInputValue(formId, ctrlId)
{
	return get_control(formId).elements[ctrlId].value;
}

function CPCDataPaging(str)
{
	// 当前页号
	this.CurrPage = 0;
	// 页大小
	this.PageSize = 0;
	// 页数
	this.PageCount = 0;
	// 记录数
	this.Count = 0;
	// 缓存编号
	this.CacheId = 0;
	// 数据集
	this.Data = null;

	if(str && str.length > 0)
	{
		var strs = str.split(",");
		for(var i=strs.length-1; i>=0; i--)
		{
			var idx = strs[i].indexOf('=');
			if(idx < 0) continue;
			var strName = strs[i].substring(0, idx);
			var nValue = strs[i].substring(idx+1);
			if("pn" == strName)
				this.CurrPage = nValue;
			else if("ps" == strName)
				this.PageSize = nValue;
			else if("pc" == strName)
				this.PageCount = nValue;
			else if("cn" == strName)
				this.Count = nValue;
			else if("ci" == strName)
				this.CacheId = nValue;
		}
	}
}
	CPCDataPaging.prototype.setData = function(data, pageSize)
	{
		this.Data = data;
		this.CurrPage = 0;
		if(pageSize) this.PageSize = pageSize;
		this.Count = data.length;
		this.PageCount = Math.round(this.Count/pageSize + 0.5);
	};
	
	CPCDataPaging.prototype.pageData = function()
	{
		var ret = new Array();
		var idx = 0;
		var count = (this.CurrPage+1)*this.PageSize;
		if(count>this.Count) count = this.Count;
		for(var i=(this.CurrPage)*this.PageSize;i<count;i++)
		{
			ret[idx] = this.Data[i];
			idx++;
		}
		return ret;
	};
		
	CPCDataPaging.prototype.toString = function()
	{
		var str = "pn=" + this.CurrPage;
		str += ",ps=" + this.PageSize;
		str += ",pc=" + this.PageCount;
		str += ",cn=" + this.Count;
		str += ",ci=" + this.CacheId;
		return str;
	};
	
	CPCDataPaging.prototype.setCurrPage = function(idx)
	{
		if(idx < 0)
		{
			this.CurrPage = 0;
			this.CacheId = 0;
		}
		else
			this.CurrPage = idx;
	};
	
	CPCDataPaging.prototype.reset = function(size)
	{
		this.CurrPage = 0;
		this.PageCount = 0;
		this.Count = 0;
		this.CacheId = 0;
		if(!isUndefined(size)) this.PageSize = size;
	};
	
	CPCDataPaging.prototype.toHTML = function()
	{
		if(this.PageCount<2) return "";
		
		var str = "";
		var nStart = 1;
		var nEnd = 11;
		var nPage = this.CurrPage-0+1;
		if(nPage>10)
		{
			nStart = nPage - ((nPage-1)%10)-1;
			nEnd = nStart + 11;
		}
		if(nEnd>this.PageCount) nEnd = this.PageCount;
		if(nPage>1)
		{
			str += LinkToFunction("上一页", "toPage", nPage-2);
			str +=  "&nbsp;";
		}
		else
			str += "上一页&nbsp;";
		for(var i=nStart; i<=nEnd; i++)
		{
			if(i == nPage)
				str += i;
			else
				str += LinkToFunction("[&nbsp;"+i+"&nbsp;]", "toPage", i-1);
			str +=  "&nbsp;";
		}
		if(nPage < (this.PageCount))
			str += LinkToFunction("下一页", "toPage", nPage);
		else
			str += "下一页";
		return str;
	};
