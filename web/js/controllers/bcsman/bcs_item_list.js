/**
 *  wms产品资料
 *  2020-03-06 21:24:22
 */
define(
   ['module', 'controllerApi', 'base_obj_list'],
   function (module, controllerApi, base_obj_list) {
      /**
       * 控制器
       */
      var bcs_mo = [
         '$scope',
         function ($scope) {
            $scope.gridOptions = {
               columnDefs: [{
                  type: '序号'
               }, {
                  field: 'itemcode',
                  headerName: '产品编码'
               }, {
                  field: 'itemname',
                  headerName: '产品名称'
               }, {
                  field: 'organizationid',
                  headerName: '组织ID'
               }, {
                  field: 'big_category_code',
                  headerName: '大类编码'
               }, {
                  field: 'bigcategoryname',
                  headerName: '大类名称'
               }, {
                  field: 'middlecategroycode',
                  headerName: '中类编码'
               }, {
                  field: 'middlecategroyname',
                  headerName: '中类名称' 
               }, {
                  field: 'smallcategorycode',
                  headerName: '小类编码' 
               }, {
                  field: 'smallcategoryname',
                  headerName: '小类名称'
               }, {
                  field: 'creator',
                  headerName: '创建人' 
               }, {
                  field: 'createtime',
                  headerName: '创建时间'
               }, {
                  field: 'updator',
                  headerName: '更新人' 
               }, {
                  field: 'updatetime',
                  headerName: '更新时间'
               }]
            };

            // $(function () {
            //    var intervalId = setInterval(function () {
            //       if ($scope.searchPanelVisible === false) {//符合条件
            //          clearInterval(intervalId);//销毁
            //          $scope.searchPanelVisible = true;
            //       }
            //    }, 300);
            // });

            /**
              * 重写方法
              */

            //继承列表页基础控制器
            controllerApi.extend({
               controller: base_obj_list.controller,
               scope: $scope
            });

            $scope.toolButtons.delete.hide = true;
            $scope.toolButtons.add.hide = true;
         }
      ];

      //使用控制器Api注册控制器
      //需传入require模块和控制器定义
      return controllerApi.controller({
         module: module,
         controller: bcs_mo
      });
   });  