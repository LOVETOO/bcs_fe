/**
 * 客服业务受理属性页
 * 2019/7/11.     css_service_list
 * zhuohuixiong
 */
define(
    ['module', 'controllerApi', 'base_obj_prop',  '$q',    '$modal', 'directive/hcImg'],
    function (module, controllerApi, base_obj_prop,   $q,    $modal) {


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
                
				//所属区域
                $scope.commonSearchOfScparea = {
                    sqlWhere: "areatype in (4,5)",
                    afterOk: function (result) {
                        $scope.data.currItem.area_id = result.areaid;
                        $scope.data.currItem.area_code = result.areacode;
                        $scope.data.currItem.area_name = result.areaname;
						$scope.data.currItem.area_type = result.areatype;
                    }
                }
				//---所属省份
                $scope.commonSearchOfProvince = {
                     beforeOpen: function () {
                        if($scope.data.currItem.area_type == 4){

						$scope.data.currItem.province_area_id = $scope.data.currItem.area_id;
                        $scope.data.currItem.province_area_code = $scope.data.currItem.area_code;
                        $scope.data.currItem.province_area_name = $scope.data.currItem.area_name;
						}
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.province_area_id = result.areaid;
                        $scope.data.currItem.province_area_code = result.areacode;
                        $scope.data.currItem.province_area_name = result.areaname;
                    }
                }
				
				
				//所属地市
                $scope.commonSearchOfScpareaCity = {
                    beforeOpen: function () {
                        $scope.commonSearchOfScpareaCity.postData =
                            {superid: $scope.data.currItem.area_id}
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.city_area_id = result.areaid;
                        $scope.data.currItem.city_area_code = result.areacode;
                        $scope.data.currItem.city_area_name = result.areaname;
                    }
                };
				//所属区县
                $scope.commonSearchOfScpareaVillage = {
                    beforeOpen: function () {
                        $scope.commonSearchOfScpareaVillage.postData =
                            {superid: $scope.data.currItem.city_areaid}
                    },
                    afterOk: function (result) {
                        $scope.data.currItem.county_area_id = result.areaid;
                        $scope.data.currItem.county_area_code = result.areacode;
                        $scope.data.currItem.county_area_name = result.areaname;
                    }
                };

				//机构名称
                $scope.commonSearchOfScporg = {
                    sqlWhere: "",
                    afterOk: function (result) {
                        $scope.data.currItem.org_code = result.orgid;
                        
                        $scope.data.currItem.org_name = result.orgname;
                    }
                };
				//产品类别
				$scope.commonSearchOfItemClass = {
					sqlWhere:"",
					afterOk:function(result){
                        $scope.data.currItem.item_type_id = result.item_class_id;
                        $scope.data.currItem.item_type_code = result.item_class_code;
						$scope.data.currItem.item_type_name = result.item_class_name;
					}
					
				}
                
				//产品代码
				$scope.commonSearchOfItemClassCode = {
					sqlWhere:"",
					afterOk:function(result){
						$scope.data.currItem.item_code = result.item_class_code;
						$scope.data.currItem.item_name = result.item_class_name;
					}
					
				}
				//网点名称
				$scope.commonSearchOfItemFixOrg = {
					sqlWhere:"",
					afterOk:function(result){
						$scope.data.currItem.fix_org_code = result.fix_org_code;
						$scope.data.currItem.fix_org_name = result.fix_org_name;
					}
					
				}
				
				//指定网点名称
				$scope.commonSearchOfItemTheFixOrg = {
					sqlWhere:"",
					afterOk:function(result){
						$scope.data.currItem.the_fix_org_code = result.fix_org_code;
						$scope.data.currItem.the_fix_org_name = result.fix_org_name;
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