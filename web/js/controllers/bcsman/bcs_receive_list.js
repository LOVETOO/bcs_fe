/**
 * 条码库管理列表页
 * @since 2019-12-18
 * 巫奕海
 */
define(
   ['module', 'controllerApi', 'base_obj_list'],
   function (module, controllerApi, base_obj_list) {
      /**
       * 控制器
       */
      var controller = [
         '$scope',
         function ($scope) {
            $scope.gridOptions = {
               columnDefs: [{
                  type: '序号'
               }, {
                  field: 'stat',
                  headerName: '单据状态',
                  hcDictCode: 'stat'
               }, {
                  field: 'orgname',
                  headerName: '领用部门'
               }, {
                  field: 'code',
                  headerName: '领用单据号'
               }, {
                  field: 'purchno',
                  headerName: 'EBS领料单号'
               }
                  , {
                  field: 'vendorcode',
                  headerName: '供应商编码'
               }, {
                  field: 'pageno',
                  headerName: '防伪批次号'
               }
                  , {
                  field: 'qty',
                  headerName: '领用数量',
                  type: "数量"
               }
                  , {
                  field: 'username',
                  headerName: '领用人姓名'
               }, {
                  field: 'factbase',
                  headerName: '基地',
                  hcDictCode: 'bcs.factbase'
               }
                  , {
                  field: 'creator',
                  headerName: '创建人'
               }
                  , {
                  field: 'createtime',
                  headerName: '创建时间'
               }
                  , {
                  field: 'updator',
                  headerName: '更新用户'
               }
                  , {
                  field: 'updatetime',
                  headerName: '更新时间'
               }
                  , {
                  field: 'description',
                  headerName: '说明'
               }]
            };

            //继承列表页基础控制器
            controllerApi.extend({
               controller: base_obj_list.controller,
               scope: $scope
            });
         }
      ];

      //使用控制器Api注册控制器
      //需传入require模块和控制器定义
      return controllerApi.controller({
         module: module,
         controller: controller
      });
   });