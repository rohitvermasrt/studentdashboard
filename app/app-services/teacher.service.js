(function () {
    'use strict';

    angular
        .module('app')
        .factory('TeacherService', Service);

    function Service($http, $q) {
        var service = {};

        service.GetCurrent = GetCurrent;
        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByTeacherName = GetByTeacherName;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        return service;

        function GetCurrent() {
            return $http.get('/teacher/current').then(handleSuccess, handleError);
        }

        function GetAll() {
            return $http.get('/teacher').then(handleSuccess, handleError);
        }

        function GetById(_id) {
            return $http.get('/teacher/' + _id).then(handleSuccess, handleError);
        }

        function GetByTeacherName(name) {
            return $http.get('/teacher/' + name).then(handleSuccess, handleError);
        }

        function Create(teacher) {
            return $http.post('/teacher/add', teacher).then(handleSuccess, handleError);
        }

        function Update(teacher) {
            return $http.put('/teacher/' + teacher._id, teacher).then(handleSuccess, handleError);
        }

        function Delete(_id) {
            return $http.delete('/teacher/' + _id).then(handleSuccess, handleError);
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    }

})();
