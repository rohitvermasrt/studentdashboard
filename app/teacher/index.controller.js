(function () {
    'use strict';

    angular
        .module('app')
        .controller('Teacher.IndexController',Controller);

    function Controller($window, TeacherService, FlashService) {
        var vm = this;

        vm.teachers = null;
        vm.addNew = addNew;
        vm.isAdd = false;
        function addNew(){
           // $window.location = 'student.html';
            vm.isAdd = true;
        };
        vm.saveTeacher = saveTeacher;
        vm.editTeacher = editTeacher;
        vm.deleteTeacher = deleteTeacher;
        initController();

        function initController() {
             vm.teacher = {
                    name : "",
                    sex : "",
                    age : 0,
                    subject : ""
                };  
            // get current user
            TeacherService.GetAll().then(function (teachers) {
                vm.teachers = teachers;
                vm.isAdd = false;
            });
        }
        
        function saveTeacher() {
                (!vm.teacher._id?TeacherService.Create(vm.teacher) : TeacherService.Update(vm.teacher))
                .then(function (teacher) {
                    vm.isAdd=false;
                    FlashService.Success(!vm.teacher._id?'Teacher Created successfully' : 'Teacher updated successfully');
                    vm.teacher._id = null;
                    initController();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                    vm.isAdd=false;
                    initController();
                });
        }
        function editTeacher(teacherId)
        {
                vm.isAdd = true;
                TeacherService.GetById(teacherId)
                .then(function(teacher){
                    vm.teacher = {
                        name : teacher.name,
                        sex : teacher.sex,
                        age : teacher.age,
                        subject : teacher.subject,
                        _id : teacher._id
                    }; 
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
                
        };

        function deleteTeacher(teacherId) {
            if(confirm('Are you sure to delete selected teacher?'))
            {
                  TeacherService.Delete(teacherId)
                    .then(function () {
                        // log user out
                        FlashService.Success('Teacher Deleted successfully');
                        initController();
                    })
                    .catch(function (error) {
                        FlashService.Error(error);
                    });
            }
        }
    }

})();