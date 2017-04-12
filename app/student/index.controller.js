(function () {
    'use strict';

    angular
        .module('app')
        .controller('Student.IndexController',Controller);

    function Controller($window, StudentService,TeacherService, FlashService) {
        var vm = this;

        vm.students = null;
        vm.addNew = addNew;
        vm.isAdd = false;
        function addNew(){
           // $window.location = 'student.html';
            vm.isAdd = true;
            initStudent();
        };
         vm.saveStudent = saveStudent;
         vm.cancel = cancel;
         vm.editStudent = editStudent;
         vm.deleteStudent = deleteStudent;
         vm.searchStudens = searchStudens;
        //  vm.deleteUser = deleteUser;

        function initStudent() {
             vm.student = {
                    _id : null,
                    name : "",
                    sex : "",
                    age : 0,
                    class : 0,
                    imagePath : null,
                    classTeacher : ""
                };  
        }
        initController();

        function initController() {
            initStudent();
            // get current user
            StudentService.GetAll().then(function (students) {
                vm.students = students;
                vm.isAdd = false;
            });

            TeacherService.GetAll().then(function(teachers){
                vm.teachers = teachers;
            });
        }
        
        function saveStudent() {
                var bucketPath = "https://s3.amazonaws.com/student-dashboard/";
                if(vm.student.sex==="Male"){
                    vm.student.imagePath = bucketPath +  "male.svg";
                }else{
                    vm.student.imagePath = bucketPath +  "female.svg";
                };
                (!vm.student._id?StudentService.Create(vm.student):StudentService.Update(vm.student))
                .then(function (student) {
                    vm.isAdd=false;
                    FlashService.Success(!vm.student._id?'Student created successfully' : 'Student updated successfully');
                    vm.student._id = null;
                    initController();
                })
                .catch(function (error) {
                    FlashService.Error(error);
                    vm.isAdd=false;
                    initController();
                });
        }

        function editStudent(studentId)
        {
                // if(confirm('Are you sure to delete the student'))
                // {
                    vm.isAdd = true;
                    StudentService.GetById(studentId)
                    .then(function(student){
                        vm.student = {
                            name : student.name,
                            sex : student.sex,
                            age : student.age,
                            class : student.class,
                            imagePath : student.imagePath,
                            classTeacher : student.classTeacher ? student.classTeacher : "",
                            _id : student._id
                        }; 
                    })
                    .catch(function(error){
                        FlashService.Error(error);
                    });
                // }
        };

        function deleteStudent(studentId){
            if(confirm('Are you sure to delete the selected student?'))
            {
                StudentService.Delete(studentId)
                .then(function(){
                    FlashService.Success('Student deleted successfully');
                    initController();
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
            }
        };
        function cancel(){
            vm.isAdd = false;
        }
        
        function searchStudens(){
            var searchKeyword = vm.searchKeyword.toString().trim();
            if(vm.searchKeyword.toString().trim().length>0){
                StudentService.Search(searchKeyword)
                .then(function(students){
                    vm.students = students;
                })
                .catch(function(error){
                    FlashService.Error(error);
                });
            }else{
                alert('Please enter something to search');
            }
        }
        // function deleteUser() {
        //     UserService.Delete(vm.user._id)
        //         .then(function () {
        //             // log user out
        //             $window.location = '/login';
        //         })
        //         .catch(function (error) {
        //             FlashService.Error(error);
        //         });
        // }
    }

})();