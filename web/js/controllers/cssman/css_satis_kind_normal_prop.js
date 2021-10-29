/**
 * 正负激励申请属性
 * 2019/7/17.     
 * zhuohuixiong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop', 'requestApi', 'openBizObj', 'swalApi', '$q', 'numberApi', 'dateApi', 'fileApi', '$modal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, requestApi, openBizObj, swalApi, $q, numberApi, dateApi, fileApi, $modal) {


        var CssServiceHeaderProp = [
            '$scope',
            function ($scope) {
                

                //继承基础控制器
                controllerApi.extend({
                    controller: base_obj_prop.controller,
                    scope: $scope
                });
                /*----------------------------------标签定义-------------------------------------------*/

                $scope.tabs.base = {
                    title: '基本信息',
                    active: true
                };
				//机构通配查询
				$scope.commonSearchOfScporg = {
					sqlWhere:"",
					afterOk:function(result){
						$scope.data.currItem.entid = result.orgid;
						$scope.data.currItem.entname = result.orgname;
					
						}
				};
				//网点名称
				$scope.commonSearchOfItemFixOrg = {
					sqlWhere:"",
					afterOk:function(result){
						$scope.data.currItem.assign_idpath = result.fix_org_id;
						$scope.data.currItem.assign_name = result.fix_org_name;
					}
					
				};
				
                
				
				
            }
]
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: CssServiceHeaderProp
    });
});