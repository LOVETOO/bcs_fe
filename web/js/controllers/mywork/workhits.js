define(['app'], function (app) {
/**
 * 工作流提醒
 */
function myWorkHits($scope,$timeout,$location, $rootScope,$state,notify,BasemanService,localeStorageService){

	$scope.myworkhits = {};
	BasemanService.pageInit($scope);


	$scope.oldpass="";
	$scope.newpass="";
	$scope.renewpass="";



    $scope.chgpsw = function() {
		if ($scope.newpass!=$scope.renewpass)
		{
			alert("两次输入的密码不一致!");
		}
		var  postdata={
	             userpass :$scope.oldpass,
				 userpass2 :$scope.newpass
	    };
		var promise = BasemanService.RequestPost("login","setuserpassword",postdata);
        promise.then(function(data){
			 	if(data.issuccess == "1"){
					alert("密码修改成功!!!");
				}else{
					alert("密码修改失败!!!");
				}
        });

	}

	// 查询
    $scope.searchcnt= function() {
    	var sqlwhere = BasemanService.getSqlWhere(["wfname","subject"],$scope.searchtext);
		var  postdata={
	          flag:5,
	          pagination:"pn=1,ps="+$scope.pageSize+",pc=0,cn=0,ci=0",
              sqlwhere:sqlwhere
	    };
		var promise = BasemanService.RequestPost("omsworkhint","search",postdata);
        promise.then(function(data){
			 $scope.newwf=data.newwf;
	       	 $scope.myworkhits = data.workhits;
			 console.log($scope.myworkhits );
	       	// BasemanService.pageInfoOp($scope,data.pagination);
        });
	}


	$scope.closebox = function(){
		$location.path("/main/omsworkhint");
	}

}

/*
function BestTimerCtrl($scope) {



  $scope.clock = {
    now : new Date()
  };

  var updateClock = function() {
    $scope.clock.now = new Date()
  };

  setInterval(function() {
    $scope.$apply(updateClock);
  }, 1000);

  updateClock();

};
*/

function WorkHitTimerCtrl($scope,$location,$state,BasemanService,localeStorageService) {

   $scope.newwf=0;
   $scope.myworkhits = {};

   $scope.MyWork = function(index) {
	    var  wftempid=$scope.myworkhits[index].wftempid;
		sessionStorage.setItem("wftempid",wftempid);
		console.log('wftempid:'+wftempid)
		$state.go("crmman.mywork1", {}, { reload: true });
    };

   var getMyWorkCount = function() {
     	var  postdata={flag:5};
		var promise = BasemanService.RequestPost("omsworkhint","search",postdata);
        promise.then(function(data){
			 $scope.newwf=data.newwf;
	       	 $scope.myworkhits = data.workhits;
        });
    };

     setInterval(function() {
           $scope.$apply(getMyWorkCount);
      }, 30000);

    getMyWorkCount();
}

// angular.module('inspinia')
app
	.controller("myWorkHits",myWorkHits)
	.controller("WorkHitTimerCtrl",WorkHitTimerCtrl)
	;

});