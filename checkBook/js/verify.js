var app = angular.module('myApp', []);
app.controller('myController',['$scope','$http',function($scope,$http){
  $scope.url = 'https://web.princesky.com'
  // $scope.url = 'http://192.168.2.50:8087'
  $scope.mark = 0;
  $scope.count = 0;
  $scope.ismore = 0
  $scope.pageSize = 20;
  $scope.pageNo = 1;
  $scope.lists = []
	$scope.check = function(){
    $('.check').addClass('hover')
    setTimeout(()=>{
    $('.check').removeClass('hover')
    },100)
    $scope.pageSize = 20;
    $scope.pageNo = 1;
    $scope.getLists()
  }
  $scope.more = function(){
    if($scope.ismore){
      $scope.pageNo++
      $scope.getLists()
    }
  }
  $scope.getLists = function(e){
      var dialog1 = $(document).dialog({
        type : 'notice',
        infoIcon: 'images/loading.gif',
        infoText: '查询中'
        });
        var data = {
            spCode:$('#code').val(),
            spName:$('#name').val(),
            ckPlace:$('#place').val(),
            pageSize:$scope.pageSize,
            pageNo:$scope.pageNo
          };
          $.ajax({
          type: 'get',
          url: $scope.url+'/platform/v1/api/vbookSearch/listData',
          data: data,
          contentType:'application/json',
          success: function(res){
                  dialog1.close()
                  console.log(res)
                  $scope.count = res.count
                  if(res.count>$scope.pageNo*$scope.pageSize){
                    $scope.ismore = 1
                    console.log('更多')
                  }else{
                    $scope.ismore = 0
                  }
                if(res.list.length>0){
                    if(res.pageNo>1){
                      $scope.lists = $scope.lists.concat(res.list);
                      $scope.$apply()
                      return;
                    }
                    $scope.mark = 1;
                    $scope.lists = res.list
                    $scope.$apply()
                  }else{
                    console.log('没了')
                    $scope.mark = 0;
                    $scope.lists = []
                    $scope.$apply()
                  }
          },
          error:function(res){
            dialog1.close()
            var dialog2 = $(document).dialog({
                content: '系统错误，请稍后再试',
                overlayClose: true
            });
          }
        });
  }
}])
