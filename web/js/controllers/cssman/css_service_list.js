/**
 * 客服业务受理
  2019/7/10.     
 * zhuohuixiong
 */
define(
    ['module', 'controllerApi', 'base_obj_list'],
    function (module, controllerApi, base_obj_list) {
        'use strict';
    
        /**
         * 控制器
         */
        var control = [
            '$scope',
            function ($scope) {

                $scope.gridOptions = {
                    columnDefs:[{
                        type:'序号'
                    },{
                        field:'stat',
                        headerName:'单据状态'
                    },{
                        field:'is_input',
                        headerName:'录单状态',
                        hcDictCode:'whether'
                    },{
                        field:'appeal_no',
                        headerName:'受理单编号'
                    },{
                        field:'sdispatch_no',
                        headerName:'呼叫中心单号'
                    },{
                        field:'confirm_sub_time',
                        headerName:'受理时间'
                    },{
                        field:'appeal_times',
                        headerName:'受理次数',
                        type:'数量'
                    },{
                        field:'org_code',
                        headerName:'机构编码'
                    },{
                        field:'org_name',
                        headerName:'机构名称'
                    },{
                        field:'fix_org_code',
                        headerName:'网点编码'
                    },{  
                        field:'appeal_kind_id',
                        headerName:'受理类型'
                    },{
                        field:'is_reconsiding',
                        headerName:'复议状态',
                        hcDictCode:'whether'
                    },{//--------------------
                        field:'reconsider_note',
                        headerName:'申请理由'
                    },{
                        field:'reconsider_man',
                        headerName:'申请人'
                    },{
                        field:'reconsider_time',
                        headerName:'申请时间'
                    },{
                        field:'reconsider_decide',
                        headerName:'判定原因'
                    },{
                        field:'',
                        headerName:'事件类型'
                    },{//********** */
                        field:'',
                        headerName:'咨询类型'
                        /***  TODO*/
                    },{
                        field:'',
                        headerName:'信息来源方式'
                    },{
                        field:'',
                        headerName:'信息来源'
                    },{
                        field:'',
                        headerName:'信息定位'
                    },{
                        field:'enduser_name',
                        headerName:'姓名'
                    },{
                        field:'',
                        headerName:'区号'
                    },{
                        field:'',
                        headerName:'家庭电话'
                    },{
                        field:'tel',
                        headerName:'办公电话'
                    },{
                        field:'mobile',
                        headerName:'手机'
                    },{
                        field:'',
                        headerName:'小灵通'
                    },{
                        field:'email',
                        headerName:'电子邮箱'
                    },{
                        field:'country_area_code',
                        headerName:'区域编码'
                    },{
                        field:'country_area_name',
                        headerName:'区域名称'
                    },{
                        field:'province_area_name',
                        headerName:'区域所属省份'
                    },{
                        field:'city_area_name',
                        headerName:'区域所属市'
                    },{
                        field:'county_area_name',
                        headerName:'区域所属县'
                    },{
                        field:'item_type_name',
                        headerName:'产品类别'
                    },{
                        field:'enduser_address',
                        headerName:'地址'
                    },{
                        field:'item_code',
                        headerName:'产品编码'
                    },{
                        field:'',
                        headerName:'产品描述'
                    },{
                        field:'spec',
                        headerName:'产品型号'
                    },{
                        field:'purch_date',
                        headerName:'购买日期'
                    },{
                        field:'buy_address',
                        headerName:'购买商店'
                    },{
                        field:'barcode',
                        headerName:'产品条码'
                    },{
                        field:'bill_no',
                        headerName:'票据号'
                    },{
                        field:'purch_price',
                        headerName:'购买价格',
                        type:'金额'
                    },{
                        field:'problem_code',
                        headerName:'故障现象编码'
                    },{
                        field:'problem_name',
                        headerName:'故障现象名称'
                    },{
                        field:'problem_code2',
                        headerName:'故障现象2编码'
                    },{
                        field:'problem_name2',
                        headerName:'故障现象2名称'
                    },{
                        field:'problem_code3',
                        headerName:'故障现象3编码'
                    },{
                        field:'problem_name3',
                        headerName:'故障现象3名称'
                    },{
                        field:'confirm_note',
                        headerName:'内容描述'
                    },{
                        field:'',
                        headerName:'受理人员'
                    },{
                        field:'inst_flag',
                        headerName:'上门安装',
                        hcDictCode:'whether'
                    },{
                        field:'is_needfix',
                        headerName:'需要维修',
                        hcDictCode:'whether'
                    },{
                        field:'assign_org_idpath',
                        headerName:'指定网点'
                    },{
                        field:'assign_org_code',
                        headerName:'指定网点编码'
                    },{
                        field:'assign_org_name',
                        headerName:'指定网点名称'
                    },{
                        field:'',
                        headerName:'结算折扣'
                    },{
                        field:'',
                        headerName:'不计算上门费'
                    },{
                        field:'',
                        headerName:'预约时间'
                    },{
                        field:'',
                        headerName:'预约说明'
                    },{
                        field:'confirm_man',
                        headerName:'确认人'
                    },{
                        field:'confirm_time',
                        headerName:'确认时间'
                    },{
                        field:'',
                        headerName:'确认信息'
                    },{
                        field:'deal_man',
                        headerName:'处理人'
                    },{
                        field:'deal_time',
                        headerName:'处理时间'
                    },{
                        field:'deal_info_type',
                        headerName:'处理结果'
                    },{
                        field:'is_hasvipcard',
                        headerName:'Vip卡持有情况',
                        hcDictCode:'whether'
                    },{
                        field:'vip_no',
                        headerName:'VIP卡号'
                    },{
                        field:'dealonline',
                        headerName:'在线处理',
                        hcDictCode:'whether'
                    },{
                        field:'barcode',
                        headerName:'产品批号'
                    },{
                        field:'repair_way',
                        headerName:'服务方式'
                    },{
                        field:'distance',
                        headerName:'公里数',
                        type:'数量'
                    },{
                        field:'repair_no',
                        headerName:'保修凭证'
                    },{
                        field:'fix_step_name',
                        headerName:'维修类型名称'
                    },{
                        field:'grease',
                        headerName:'油污',
                        type:'数量'
                    },{
                        field:'color',
                        headerName:'色泽',
                        type:'数量'
                    },{
                        field:'scratches',
                        headerName:'划伤',
                        type:'数量'
                    },{
                        field:'character_content',
                        headerName:'外观特征描述'
                    },{
                        field:'powerline',
                        headerName:'电源线'
                    },{
                        field:'random_attach',
                        headerName:'其他随机附件'
                    },{
                        field:'door_free_appeal',
                        headerName:'上门费',
                        type:'金额'
                    },{
                        field:'tech_fee',
                        headerName:'修理费',
                        type:'金额'
                    },{
                        field:'tall_fee',
                        headerName:'配件费',
                        type:'金额'
                    },{
                        field:'other_amt',
                        headerName:'其他费用',
                        type:'金额'
                    },{
                        field:'total_amt',
                        headerName:'合计费用',
                        type:'金额'
                    }
                ]

                };

                
                 //继承列表页基础控制器
        controllerApi.extend({
            controller: base_obj_list.controller,
            scope: $scope
        });
    }
]
    //使用控制器Api注册控制器
    //需传入require模块和控制器定义
    return controllerApi.controller({
        module: module,
        controller: control
    });
});