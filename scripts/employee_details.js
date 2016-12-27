angular.module('employeeApp', []).controller('employeeAppController', function($scope,$http){

    	$scope.employees = []; 
    	$scope.name = '';
		$scope.nameToSearch = '';
    	$scope.email = '';
		$scope.role = '';
		
    	//load all employee
    	$scope.init = function(){
			$scope.employees = []; 
			$scope.name = '';
			$scope.nameToSearch = '';
			$scope.email = '';
			$scope.role = '';
		
			$http.get('http://localhost:3000/api/getAllEmployees').
			success(function(data) {
				$scope.employees = data;
			});
    	};
		
		//add new employee
		$scope.addNewEmployee = function(){
			var data = {
                name: $scope.name,
                email: $scope.email,
				role: $scope.role
            };
			if(!data.name){
				data.name = '';
			}
			if(!data.email){
				data.email = '';
			}
			if(!data.role){
				data.role = '';
			}

            var config = {
                headers : {
                    'Content-Type': 'application/json'
                }
            }
		
			$http.post('http://localhost:3000/api/addNewEmployee',data,config).
			success(function(data) {
				$scope.employees = data;
			});
			location.reload(); 
		};
		
		$scope.deleteEmployee = function(emp_id){				
			$http.delete('http://localhost:3000/api/deleteEmployee',{params: {empId: emp_id}}).
			success(function(data) {
				$scope.employees = data;
				console.log($scope.employees);
			});
			location.reload(); 			
		};
		
		$scope.searchEmployee = function(){
			$http.get('http://localhost:3000/api/getEmployeesLike',{params: {empName: $scope.nameToSearch}}).
			success(function(data) {
				$scope.employees = data;
				console.log($scope.employees);
			});
		};
		
		$scope.init();

    });