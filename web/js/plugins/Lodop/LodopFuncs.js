var CreatedOKLodop7766 = null, CLodopIsLocal;

var Lod = {};
Lod.swal = function (title, version) {
    swal({
        title: title,
        text: '',
        type: "warning",
        html: true,
        showCancelButton: true,
        confirmButtonColor: "#1ab394",
        confirmButtonText: "执行安装",
        cancelButtonText: "取消",
        closeOnConfirm: false,
        allowOutsideClick: true
    }, function (bool) {
        sweetAlert.close();
        if (fun) {
            fun(bool);
        }
    });
}
Lod.swalError = function (title, fun) {
    swal({
        title: title,
        type: "warning",
        closeOnConfirm: false,
        showCancelButton: true,
        allowOutsideClick: true,
        html: true,
        confirmButtonText: "执行安装",
        cancelButtonText: "取消"
    }, function (bool) {
        sweetAlert.close();
        if (fun) {
            fun(bool);
        }
    });
}


//====页面引用CLodop云打印必须的JS文件,用双端口(8000和18000）避免其中某个被占用：====
if (CreatedOKLodop7766 == null) {
    var src1 = "http://localhost:8000/CLodopfuncs.js?priority=1";
    var src2 = "http://localhost:18000/CLodopfuncs.js?priority=0";

    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    var oscript = document.createElement("script");
    oscript.src = src1;
    head.insertBefore(oscript, head.firstChild);
    oscript = document.createElement("script");
    oscript.src = src2;
    head.insertBefore(oscript, head.firstChild);
    CLodopIsLocal = !!((src1 + src2).match(/\/\/localho|\/\/127.0.0./i));
}

function getLodop(oOBJECT, oEMBED) {
    /**************************
     本函数根据浏览器类型决定采用哪个页面元素作为Lodop对象：
     IE系列、IE内核系列的浏览器采用oOBJECT，
     其它浏览器(Firefox系列、Chrome系列、Opera系列、Safari系列等)采用oEMBED,
     如果页面没有相关对象元素，则新建一个或使用上次那个,避免重复生成。
     64位浏览器指向64位的安装程序install_lodop64.exe。
     **************************/

    var strCLodopInstall_1 = "<br>Web打印服务CLodop未安装启动（若此前已安装过，可<a color='#FF00FF' href='CLodop.protocol:setup' target='_self'><font color='#FF00FF'>点这里直接再次启动</font></a>），成功后请刷新本页面。";
    var strCLodopUpdate = "<br>Web打印服务CLodop需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'><font color='#FF00FF'>执行升级</font></a>,升级后请刷新页面。";
    var LODOP;
    try {
        //=====判断浏览器类型:===============
        try {
            if (CreatedOKLodop7766 != null) {
                LODOP = CreatedOKLodop7766;
            } else {
                LODOP = getCLodop();
                CreatedOKLodop7766 = LODOP;
            }
        } catch (err) {
        }
        if (!LODOP) {
            Lod.swalError(strCLodopInstall_1, function (bool) {
                if (bool && CLodopIsLocal) {
                    window.location.href = "CLodop_Setup_for_Win32NT.exe";
                } else if (bool && !CLodopIsLocal) {
                    window.location.href = "CLodop.protocol:setup";
                }
            });
            return;
        } else {
            if (LODOP.CVERSION < "3.0.6.0") {
                Lod.swalError(strCLodopUpdate, function (bool) {
                    if (bool) {
                        window.location.href = "CLodop_Setup_for_Win32NT.exe"
                    }
                });
                return null;
            }
            if (oEMBED && oEMBED.parentNode)
                oEMBED.parentNode.removeChild(oEMBED);
            if (oOBJECT && oOBJECT.parentNode)
                oOBJECT.parentNode.removeChild(oOBJECT);
        }

        //=====如下空白位置适合调用统一功能(如注册码、语言选择等):====
        LODOP.SET_LICENSES("\u5e7f\u5dde\u534f\u5546\u79d1\u6280\u6709\u9650\u516c\u53f8", "25EB9FD5AB0D5C823C07D05CDF74BC65", "", "");
        //============================================================
        return LODOP;
    } catch (err) {
        Lod.swalError(strCLodopInstall_1, function (bool) {
            if (bool) {
                window.location.href = "CLodop_Setup_for_Win32NT.exe"
            }
        });
        return LODOP;
    }
    ;
}



