/**
 * 条码库管理列表页
 * @since 2019-12-18
 * 巫奕海
 */ 
define(
    ['module', 'controllerApi', 'base_obj_list','requestApi'],
    function (module, controllerApi, base_obj_list,requestApi) {
        /**
         * 控制器
         */
        var bcs_barcode_list = [
            '$scope', 
            function ($scope) {
                $scope.gridOptions = {
                    hcEvents: {
                        cellFocused: function (params) {
                            $scope.toolButtons.delete.hide = function() {
                                if($scope.currItem.status== "completed"){
                                    return true;
                                }else{
                                    return false;   
                                }
                            };
                        }
                    },
                    columnDefs: [{
                        type: '序号'
                    }, {
                        field: 'code',
                        headerName: '生成批次号', 
                    } , {
                        field: 'barcode_type',
                        headerName: '条码类型',
                        hcDictCode:'barcode_type'
                    }, {
                        field: 'status',
                        headerName: '条码状态',
                        hcDictCode:'bcs.barcodestatus'
                    }, {
                        field: 'quantity',
                        headerName: '生成数量(万)', 
                        type:"数量"                  
                    }, {
                        field: 'pagesize',
                        headerName: '每卷数量(个/卷)', 
                        type:"数量"                  
                    } , {
                        field: 'enabled', 
                        headerName: '可用',
                        hcDictCode:'enabled'
                    }, {
                        field: 'brand',
                        headerName: '品牌',
                        hcDictCode:'bcs.brand'
                    }, {
                        field: 'pagetype',
                        headerName: '纸张规格',
                        hcDictCode:'pagetype'
                    },{
                        field: '',
                        headerName: '下载',
                        cellRenderer: doDownLoad,
                        cellStyle: {
                            'text-align': 'center'
                        }
                    }, {
                        field: 'for_print',
                        headerName: '下发状态',
                        hcDictCode:'for_print'
                    }, {
                        field: 'download_frequency',
                        headerName: '下载次数'
                    }, {
                        field: 'createid',
                        headerName: '创建人'
                    }, {
                        field: 'createat',
                        headerName: '创建时间'
                    }, {
                        field: 'description',
                        headerName: '备注'
                    }] 
                }; 

                //生成下载按钮
                function doDownLoad(parms){
                    var html=$('<button>',{
                        text:'下载',
                        css:{
                            backgroundColor:"#007bff",
                            borderRadius:'0.25rem',
                            border:'0',
                            size:'10px',
                            margin: 'auto',
                            paddingLeft:'1rem',
                            paddingRight:'1rem',
                            color:"#fff"
                        },
                        on:{
                            click:function(){
                                requestApi.post({
                                    classId: "bcs_barcode_lots",
                                    data: {
                                        bclotsid: parms.data.bclotsid
                                    },
                                    action: "downloads"
                                }).then(function (data) {
                                    var a = $('<a></a>');
                                    a.attr('href', "../"+data.absolute_path + "/" + data.filename);
                                    a.prop('download', data.filename);
                                    a.get(0).click();
                                })
                            }
                        }
                    }) 
                    return parms.data.status == "completed"?html[0]:null
                } 

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
            controller: bcs_barcode_list
        });
    });