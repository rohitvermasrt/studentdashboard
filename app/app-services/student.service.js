(function () {
    'use strict';

    angular
        .module('app')
        .factory('StudentService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByStudentname = GetByStudentname;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.Search = Search;
        return service;

        function GetCurrent() {
            return $http.get('/student/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/student').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/student/' + _id).then(handleSuccess, handleError);
        }

        function GetByStudentname(name) {
            return $http.get('/student/' + name).then(handleSuccess, handleError);
        }

        function Create(student) {
            return $http.post('/student/add', student).then(handleSuccess, handleError);
        }

        function Update(student) {
            return $http.put('/student/' + student._id, student).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/student/' + _id).then(handleSuccess, handleError);
        }

        function Search(searchKeyword)
        {
            return $http.get('/student/search/' + searchKeyword).then(handleSuccess,handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
