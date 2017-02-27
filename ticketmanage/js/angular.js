var app = angular.module('myApp', ['ngRoute']);

app.config(["$routeProvider", function($routeProvider) {
    $routeProvider.when("/flightManage", {
        templateUrl: 'flight_manage.html'
    }).when("/ticketManage", {
        templateUrl: "tickets_manage.html"
    }).when("/order", {
        templateUrl: "order.html"
    }).when("/myOrder", {
        templateUrl: "myOrder.html"
    }).when("/memberManage", {
        templateUrl: "memberManage.html"
    }).otherwise({
        templateUrl: "first.html"
    });
}]);

//航班管理
app.controller('flightController', ['$scope', '$http', '$httpParamSerializer', function($scope, $http, $hps) {
    //调用的方法
    $scope.allFlights = function(pageIndex) {
        $http.post("http://192.168.168.21.60:8080/ticketSystem/flight/getFlightsByFuzzy", $hps($scope.searchFlights) + "&pageNo=" + pageIndex, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(function(resp) {
            $scope.params = resp.data.results;
            var totalPages = resp.data.pageCount;
            var currentPage = resp.data.currentPage;
            //Bootstrap 分页 
            var options = {
                bootstrapMajorVersion: 3,
                currentPage: currentPage,
                totalPages: totalPages,
                size: "normal",
                alignment: "center",
                onPageClicked: function(e, originalEvent, type, page) {
                    $scope.allFlights(page);
                }
            }
            $('#paginator').bootstrapPaginator(options);
        });
    }
    $scope.allFlights(1);

    //打开添加航班模态框
    $scope.openAdd = function(){
        $("#add_modal").modal("show");
        $scope.addFlight = "";
    }
    //模态框-添加
    $scope.doAddFlight =function(){
        $http.post("http://192.168.168.21.60:8080/ticketSystem/flight/add",$hps($scope.addFlight),{
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(function(resp){
            $("#add_modal").modal("hide");
            $scope.allFlights(1);
        })
    }

    //打开修改模态框
    $scope.openModify = function(no){
        $http.post("http://192.168.168.21.60:8080/ticketSystem/flight/getFlightDetail", "no=" + no,{
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(function(resp){
            $scope.Flight = resp.data.data;
        });
        $("#modify_modal").modal("show");
    }
    //模态框-修改
    $scope.modifyFlight = function(){
        $http.post("http://192.168.21.60:8080/ticketSystem/flight/modify", $hps($scope.Flight), {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(function(resp) {
            $("#modify_modal").modal("hide");
            $scope.allFlights(1);
        });
    }

    //删除
    $scope.delFlight = function(id) {
        $http.post("http://192.168.168.21.60:8080/ticketSystem/flight/delete", "id=" + id, {
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            }
        }).then(function(resp) {
            $scope.allFlights(1);
        });
    }

}]);

