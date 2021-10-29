/**
 * @qqw 2016.5.18 
 */
;(function(global,factory){
    typeof exports === "object" && typeof module !== 'undefined'?
        module.exports = factory():typeof define === 'function' && define.amd?define(factory):global.datamap = factory()
}(this,function(){
    "use strict";
    var hookCallback;
    function utils_hooks__hooks(){
        return hookCallback.apply(null,arguments);
    }
    function setHookCallback (callback){
        hookCallback = callback;
    }
    function isArray(input){
        return Object.prototype.toString.call(input) === '[object Array]';
    }
    function isDate(input) {
        return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
    }
    function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) {
            res.push(fn(arr[i], i));
        }
        return res;
    }
    function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
    }
    var extend = function(a, b) {
        for (var i in b) {
            if (hasOwnProp(b, i)) {
                a[i] = b[i];
            }
        }
        if (hasOwnProp(b, 'toString')) {
            a.toString = b.toString;
        }

        if (hasOwnProp(b, 'valueOf')) {
            a.valueOf = b.valueOf;
        }
        return a;
    }
    
    function datamap(config) {
    	
    }
    // Side effect imports
    utils_hooks__hooks.version = '1.0.0';
    
    utils_hooks__hooks.elements = new Array();
  //获取MAP元素个数  
    utils_hooks__hooks.size = function() {  
        return utils_hooks__hooks.elements.length;  
    };  
    //判断MAP是否为空  
    utils_hooks__hooks.isEmpty = function() {  
        return (utils_hooks__hooks.elements.length < 1);  
    };  
    //删除MAP所有元素  
    utils_hooks__hooks.clear = function() {  
    	utils_hooks__hooks.elements = new Array();  
    };  
    //向MAP中增加元素（key, value)   
    utils_hooks__hooks.put = function(_key, _value) {  
    	utils_hooks__hooks.elements.push( {  
            key : _key,  
            value : _value  
        });  
    };  
    //删除指定KEY的元素，成功返回True，失败返回False  
    utils_hooks__hooks.remove = function(_key) {  
        var bln = false;  
        try {  
            for (var i = 0; i < utils_hooks__hooks.elements.length; i++) {  
                if (utils_hooks__hooks.elements[i].key == _key) {  
                	utils_hooks__hooks.elements.splice(i, 1);  
                    return true;  
                }  
            }  
        } catch (e) {  
            bln = false;  
        }  
        return bln;  
    };  
    //获取指定KEY的元素值VALUE，失败返回NULL  
    utils_hooks__hooks.get = function(_key) {  
        try {  
            for (var i = 0; i < utils_hooks__hooks.elements.length; i++) {  
                if (utils_hooks__hooks.elements[i].key == _key) {  
                    return utils_hooks__hooks.elements[i].value;  
                }  
            }  
        } catch (e) {  
            return null;  
        }  
    };  
    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL  
    utils_hooks__hooks.element = function(_index) {  
        if (_index < 0 || _index >= utils_hooks__hooks.elements.length) {  
            return null;  
        }  
        return utils_hooks__hooks.elements[_index];  
    };  
    //判断MAP中是否含有指定KEY的元素  
    utils_hooks__hooks.containsKey = function(_key) {  
        var bln = false;  
        try {  
            for (var i = 0; i < utils_hooks__hooks.elements.length; i++) {  
                if (utils_hooks__hooks.elements[i].key == _key) {  
                    bln = true;  
                }  
            }  
        } catch (e) {  
            bln = false;  
        }  
        return bln;  
    };  
    //判断MAP中是否含有指定VALUE的元素  
    utils_hooks__hooks.containsValue = function(_value) {  
        var bln = false;  
        try {  
            for (var i = 0; i < utils_hooks__hooks.elements.length; i++) {  
                if (utils_hooks__hooks.elements[i].value == _value) {  
                    bln = true;  
                }  
            }  
        } catch (e) {  
            bln = false;  
        }  
        return bln;  
    };  
    //获取MAP中所有VALUE的数组（ARRAY）  
    utils_hooks__hooks.values = function() {  
        var arr = new Array();  
        for (var i = 0; i < utils_hooks__hooks.elements.length; i++) {  
            arr.push(utils_hooks__hooks.elements[i].value);  
        }  
        return arr;  
    };  
    //获取MAP中所有KEY的数组（ARRAY）  
    utils_hooks__hooks.keys = function() {  
        var arr = new Array();  
        for (var i = 0; i < utils_hooks__hooks.elements.length; i++) {  
            arr.push(utils_hooks__hooks.elements[i].key);  
        }  
        return arr;  
    };  
    
    
    var _datamap = utils_hooks__hooks;
    return _datamap;
}));