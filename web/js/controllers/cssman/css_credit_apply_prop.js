/**
 * 配件授信申请属性页
 * 2019/7/19.            
 * zhuohuixiong
 */

define(
    ['module', 'controllerApi', 'base_obj_prop','$q','$modal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop, $q,  $modal) {


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
                //机构名称
                $scope.commonSearchOfScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.org_id = result.orgid;
                        
                        $scope.data.currItem.org_code = result.code;
                        $scope.data.currItem.org_name = result.orgname;
                    }
                }
                //网点名称
				$scope.commonSearchOfItemFixOrg = {
					beforeOpen: function () {
                        $scope.commonSearchOfItemFixOrg.postData =
                        {fix_org_code: $scope.data.currItem.org_code,usable:2,flag:10}
                            
                    },
					afterOk:function(result){
						$scope.data.currItem.fix_org_code = result.fix_org_code;
						$scope.data.currItem.fix_org_name = result.fix_org_name;
					}
					
                }
                
                
            }
]
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: CssServiceHeaderProp
    });
});