/**
 * 特价申请
 * 2018-4-22 by mjl
 */
function sa_saleprice_head_project($scope, $location, $rootScope, $modal, $timeout, BasemanService, BaseService, notify, $state, localeStorageService, FormValidatorService) {
    $scope.data = {};
    $scope.data.currItem = {};
    //设置标题
    $scope.headername = "工程特价申请";


    //添加按钮
    var editHeaderButtons =  function (row, cell, value, column, rowData) {
        var buttonHtml = '<button class="btn btn-sm btn-info dropdown-toggle viewbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">查看</button>';
        if (rowData.stat <= 1){
            buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle delbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">删除</button>';
            //buttonHtml += '<button class="btn btn-sm btn-info dropdown-toggle checkbtn" style="padding-top: 1px;padding-bottom: 1px;margin-bottom: 1px;">审核</button>';
        }
        return buttonHtml;
    };

    $scope.yeorno = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];

    //词汇表单据状态
    $scope.billStats =[]
    BasemanService.RequestPostAjax("base_search", "searchdict", {dictcode: "stat"})
        .then(function (data) {
            HczyCommon.stringPropToNum(data.dicts);
            $scope.billStats = data.dicts;
            var billStats = [];
            for (var i = 0; i < data.dicts.length; i++) {
                billStats[i] = {
                    value: data.dicts[i].dictvalue,
                    desc: data.dicts[i].dictname
                };
            }
            if ($scope.getIndexByField('headerColumns', 'stat')) {
                $scope.headerColumns[$scope.getIndexByField('headerColumns', 'stat')].options = billStats;
                $scope.headerGridView.setColumns($scope.headerColumns);
            }
        });

    $scope.getIndexByField = function (columns, field) {
        for (var i = 0; i < $scope[columns].length; i++) {
            if ($scope[columns][i].field == field) {
                return i;
                break;
            }
        }
        return false
    }

    //作废
    $scope.is_cancellations = [
        {id: 1, name: "否"},
        {id: 2, name: "是"}
    ];

    //网格设置
    $scope.headerOptions = {
        enableCellNavigation: true,
        enableColumnReorder: false,
        editable: false,
        enableAddRow: false,
        asyncEditorLoading: false,
        autoEdit: true,
        autoHeight: false
        //onClick:dgOnClick
    };
    //定义网格字段
    $scope.headerColumns = [
        {   id: "seq",
            name: "序号",
            field: "seq",
            width: 45,
        },
        {
            name: "操作",
            width: 90,
            formatter: editHeaderButtons
        },
        {
            id: "stat",
            name: "流程状态",
            field: "stat",
            width: 75,
            options: $scope.billStats,
            formatter: Slick.Formatters.SelectOption
        },
        {
            id: "saleorder_no",
            name: "单据号",
            field: "saleorder_no",
            width: 120,
        },
        {
            id: "saleprice_type_name",
            name: "价格类型",
            field: "saleprice_type_name",
            width: 80
        },
        {
            id: "rebate_type",
            name: "返利方式",
            field: "rebate_type",
            width: 80,
            dictcode:'rebate_type'
        },
        {
            id: "project_code",
            name: "工程编码",
            field: "project_code",
            width: 150
        },
        {
            id: "project_name",
            name: "工程名称",
            field: "project_name",
            width: 180
        },
        {
            id: "orgname",
            name: "运营中心",
            field: "orgname",
            width: 100
        },
        {
            id: "customer_code",
            name: "客户编码",
            field: "customer_code",
            width: 100
        },
        {
            id: "customer_name",
            name: "客户名称",
            field: "customer_name",
            width: 192
        },
        {
            id: "is_cancellation",
            name: "作废",
            field: "is_cancellation",
            options: [
                {value: 1, desc: '否'},
                {value: 2, desc: '是'},
            ],
            formatter: Slick.Formatters.SelectOption
        },
        {
            id: "date_invbill",
            name: "制单日期",
            field: "date_invbill",
            width: 110,
            formatter: Slick.Formatters.Date
        },
        {
            id: "note",
            name: "备注",
            field: "note",
            width: 200,
        }
    ];

    //加载词汇
    BasemanService.loadDictToColumns({
        columns: $scope.headerColumns
    });
    //网格初始化
    $scope.headerGridView = new Slick.Grid("#headerGrid", [], $scope.headerColumns, $scope.headerOptions);

    //主表清单绑定点击事件
    $scope.headerGridView.onClick.subscribe(dgOnClick);
    //双击事件
    $scope.headerGridView.onDblClick.subscribe(function(e,args){$scope.viewDetail(args)});

    /**
     * 事件判断
     */
    function dgOnClick(e, args) {
        if ($(e.target).hasClass("viewbtn")) {
            $scope.viewDetail(args);
            e.stopImmediatePropagation();
        }
        //点击删除按钮处理事件
        else if ($(e.target).hasClass("delbtn")) {
            del(args);
            e.stopImmediatePropagation();
        }
	};

	/**
	 * 条件查询
	 */
	$scope.searchBySql = function () {
		$scope.FrmInfo = {
			//title: '',
			//thead: [],
			//url: "/jsp/req.jsp",
			//direct: "left",
			//sqlBlock: "",
			//backdatas: "sa_out_bill_head",
			ignorecase: 'true', //忽略大小写
			//postdata: {},
			is_high: true
		};

		$scope.FrmInfo.thead = $scope
			.headerColumns
			.slice(2)
			.map(function (column) {
				if (!column.type) {
					if (column.options)
						column.type = 'list';
					else if (column.cssClass === 'amt')
						column.type = 'number';
					else
						column.type = 'string';
				}

				return {
					name: column.name,
					code: column.field,
					type: column.type,
					dicts: column.options
				};
			});

		sessionStorage.setItem('frmInfo', JSON.stringify($scope.FrmInfo));

		return BasemanService
			.open(CommonPopController1, $scope)
			.result
			.then(function (sqlwhere) {
				$scope.sqlwhere = sqlwhere;
			})
			.then($scope.searchData);
	}

    /**
     * 查询
     */
    $scope.searchData = function (postdata) {
        if (!postdata) {
            $scope.oldPage = 1;
            $scope.currentPage = 1;
            if (!$scope.pageSize) {
                $scope.pageSize = "20";
            }
            $scope.totalCount = 1;
            $scope.pages = 1;
            postdata = {
                pagination: "pn=1,ps=20,pc=0,cn=0,ci=0"
            }
        }
		postdata.search_flag = 9;
		if (!postdata.sqlwhere)
			postdata.sqlwhere = $scope.sqlwhere;
        BasemanService.RequestPost("sa_saleprice_head", "search", postdata).then(function (data) {
            BaseService.pageInfoOp($scope, data.pagination);
            HczyCommon.stringPropToNum(data.sa_saleprice_heads);
            setGridData($scope.headerGridView, data.sa_saleprice_heads);
            //重绘网格
            $scope.headerGridView.render();
        });
    }

    /**
     * 刷新
     */
    $scope.refresh = function () {
        $scope.searchData();
    }

    /**
     * 加载网格数据
     */
    function setGridData(gridView, datas) {
        gridView.setData([]);
        var index = $scope.pageSize*($scope.currentPage-1);
        //加序号
        if (datas.length > 0) {
            for (var i = 0; i < datas.length; i++) {
                datas[i].seq = index + i + 1;
            }
        }
        //设置数据
        gridView.setData(datas);
        //重绘网格
        gridView.render();
    }

    /**
     * 详情
     * @param args
     */
    $scope.viewDetail = function (args) {
        BasemanService.openModal({"style":{width:1150,height:600},"url": "/index.jsp#/saleman/sa_saleprice_project_bill/" + args.grid.getDataItem(args.row).sa_saleprice_head_id,
            "title":$scope.headername,"obj":$scope,"action":"update",ondestroy: $scope.refresh});
    };

    /**
     * 添加
     * @param args
     */
    $scope.add = function (args) {
        $scope.data.currItem.stat = 1;
        $scope.data.currItem.is_cancellation = 1;
        $scope.data.currItem.stat = 1;
        BasemanService.openModal({"style":{width:1150,height:600},"url": "/index.jsp#/saleman/sa_saleprice_project_bill/0","title":$scope.headername,
            "obj":$scope,"action":"insert",ondestroy: $scope.refresh});
    };


    /**
     * 删除
     */
    function del(args){
        var dg = $scope.headerGridView;
        var rowidx = args.row;
        var postData = {};
        postData.sa_saleprice_head_id = args.grid.getDataItem(args.row).sa_saleprice_head_id;
        var name = args.grid.getDataItem(args.row).saleorder_no;
        BasemanService.swalWarning("删除", "确定要删除 " + name + " 吗？", function (bool) {
            if (bool) {
                //删除数据成功后再删除网格数据
                BasemanService.RequestPost("sa_saleprice_head", "delete", JSON.stringify(postData))
                    .then(function (data) {
                        $scope.refresh();
                        BasemanService.notice("删除成功！", "alert-success");//warning
                    });
            } else {
                return;
            }
        })
    };




    //网格高度自适应 , 控制器后面调用：
    BasemanService.initGird();

    //初始化分页
    BaseService.pageGridInit($scope);
}
//注册控制器
angular.module('inspinia')
    .controller('sa_saleprice_head_project', sa_saleprice_head_project)