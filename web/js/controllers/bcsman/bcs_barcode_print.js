/**
 * 2021-10-30
 * 条码扫码打印
 */
define([
  "module",
  "controllerApi",
  "$q",
  "swalApi",
  "requestApi",
  "base_obj_list",
  "base_obj_prop",
  "lodop",
], function (
  module,
  controllerApi,
  $q,
  swalApi,
  requestApi,
  base_obj_list,
  base_obj_prop,
  lodop
) {
  var controller = [
    "$scope",
    function ($scope) {
      // 继承列表页基础控制器
      controllerApi.extend({
        controller: base_obj_list.controller,
        scope: $scope,
      });

      if ($scope.$state.objConf.error) {
        console.log("🚀 ~ $scope error", $scope);
      }

      $scope.showLoading = function () {
        $(".desabled-window, .shelter").show();
      };

      $scope.hideLoading = function () {
        $(".desabled-window, .shelter").hide();
      };

      /**搜索模板 */
      $scope.searchprint = {
        action: "search",
        sqlWhere: "outeruse = 2",
        afterOk: function (result) {
          var searchObj = $scope.searchObj || {};
          Object.assign(searchObj, {
            temp_name: result.temp_name,
            temp_id: result.temp_id,
            temp_content: result.temp_content,
            print_software: result.print_software,
            temp_width: result.temp_width,
            temp_height: result.temp_height,
          });
          console.log("searchprint $scope.searchObj", $scope.searchObj);
        },
      };

      // 回车查询条码
      $scope.handlePressEnter = function () {
        var searchObj = $scope.searchObj;
        if (!searchObj.barcode) {
          setTimeout(function () {
            swalApi.error("请扫码条码或输入条码");
          }, 300);
          return;
        }

        if (!searchObj.temp_id) {
          setTimeout(function () {
            swalApi.error("请选择模板");
          }, 300);
          return;
        }

        // 获取详情
        requestApi
          .post({
            classId: "Bcs_Mo_Barcode",
            action: "select",
            data: {
              short_barcode: searchObj.barcode,
            },
          })
          .then(function (res) {
            if (!res.bcs_mo_barcode_lists || !res.bcs_mo_barcode_lists.length) {
              swalApi.error("没有找到对应产品");
              return;
            }
            res.bcs_mo_barcode_lists.forEach(
              (it) =>
                (it.production_date = new Date(it.production_date || "").Format(
                  "yyyy-MM-dd"
                ))
            );
            $scope.data.barcode_lists = res.bcs_mo_barcode_lists;
            $scope.print();
          });
      };

      $scope.data = $scope.data || {};
      $scope.data.printPreview = false; // 打印前预览
      // 打印
      $scope.print = function () {
        // 获取lodop对象
        $scope.LODOP = getLodop();
        if (!$scope.LODOP) {
          promise = $q.reject();
          return;
        }
        promise = $q.when($scope.searchObj).then($scope.handlePrint);
      };

      $scope.handlePrint = function () {
        return $q.when().then(function () {
          var temp_content = $scope.searchObj.temp_content || "";
          var temp_width = $scope.searchObj.temp_width;
          var temp_height = $scope.searchObj.temp_height;
          var barcode_lists = $scope.data.barcode_lists;
          $scope.showLoading();

          // 返回事件
          $scope.LODOP.On_Return = function (TaskID, Value) {
            $scope.hideLoading();
            // 打印成功记录打印数据
            if (Value <= 0) return;
            var sserialno = "";
            barcode_lists.forEach(function (item, idx) {
              if (sserialno == "") {
                sserialno = item.serialno;
              } else {
                sserialno += "," + item.serialno;
              }
            });
          };

          var iLength = barcode_lists.length;
          if (iLength > 49) {
            barcode_lists.forEach(function (item, index) {
              $scope.handleAddPrintItem(item, temp_content);
              // 每10条记录一组打印
              if ((index + 1) % 50 == 0) $scope.doPrint(index);
            });
            // 最后判断不是整除的话打印剩余数据
            if (iLength % 50 > 0) $scope.doPrint(iLength);
            return;
          }

          if (iLength > 0) {
            barcode_lists.forEach(function (item, index) {
              $scope.handleAddPrintItem(item, temp_content);
              $scope.LODOP.SET_PRINT_PAGESIZE(
                0,
                temp_width + "mm",
                temp_height + "mm",
                "工单打印"
              );
            });
            // 调用打印
            $scope.LODOP.SET_PRINT_MODE(
              "CUSTOM_TASK_NAME",
              "条码打印" + iLength
            );
            if ($scope.data.printPreview) {
              return $scope.LODOP.PREVIEW();
            }
            return $scope.LODOP.PRINT();
          }
        });
      };

      // 添加打印模块
      $scope.handleAddPrintItem = function (item, temp_content) {
        var serialno = item.serialno; //序号
        var item_name = item.item_name; //产品品名
        var item_model = item.item_model; //产品型号
        var itme_colour = item.itme_colour; //产品颜色
        var item_specs = item.item_specs; //产品规格
        var is_install = item.is_install; //是否包安装
        var inner_specs = item.inner_specs; //内箱规格
        var out_specs = item.out_specs; //外箱规格
        var iso_standard = item.iso_standard; //ISO标准(执行标准)
        var classication = item.classication; //等级
        var material = item.material; //材质
        var barcodeno = item.barcodeno; //二维码地址
        var barcodeno_num = HczyCommon.getQueryObject(barcodeno)["c"] || ""; //二维码 底下数字
        var erpno = item.erpno; //产品料号
        var pack_qty = item.pack_qty; //包件数
        var gweight = item.gweight; //毛重
        var pack_size = item.packsize; //包装尺寸
        var pakageno = item.pakageno; //包装工号
        var qc = item.attribute4; //qc
        var produce_code = item.attribute5; //生产码
        var factory_name = item.attribute6; //生产企业
        var factory_address = item.attribute7; //生产地址
        var pack_no = item.attribute8; //包装箱号
        var factory_workshop = item.attribute9; //加工车间
        var pack_num = item.attribute10; //每套总件数
        var production_date = item.production_date; //生产日期
        var brand = item.brand; //品牌
        var manufacturer = item.manufacturer; //制造商
        var manufacturer_address = item.manufacturer_address; //制造商地址
        var telephone = item.telephone; //电话
        var website = item.website; //官网
        var zip_code = item.zip_code; //邮编

        var strStyle = "<style>table,td,th{border-width:1px;}</style>";
        var req = /\"\[/g;
        var req0 = /\]\"/g;
        // 打印模板
        if (is_install != "是") {
          temp_content = temp_content.replace(
            "/web/img/contain-circle.png",
            "/web/img/transparent.png"
          );
        }
        try {
          eval(temp_content.replace(req, "").replace(req0, ""));
        } catch (err) {
          alert(err);
        }
        $scope.LODOP.NEWPAGEA();
      };

      // 调用打印
      $scope.doPrint = function (index) {
        $scope.LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "条码打印" + index);
        $scope.LODOP.SET_PRINT_PAGESIZE(
          0,
          $scope.searchObj.temp_width + "mm",
          $scope.searchObj.temp_height + "mm",
          "工单打印"
        );
        if ($scope.data.printPreview) {
          return $scope.LODOP.PREVIEW();
        }
        return $scope.LODOP.PRINT();
      };
    },
  ];

  // 使用控制器Api注册控制器
  // 需传入require模块和控制器定义
  return controllerApi.controller({
    module: module,
    controller: controller,
  });
});
