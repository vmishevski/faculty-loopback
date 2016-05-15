/**
 * Created by Voislav on 5/15/2016.
 */
var async = require('async');

module.exports = function (app) {
  var mysql = app.datasources.mysql;

  mysql.automigrate(['MyUser', 'Student', 'Teacher', 'Program', 'ProgramEnrollment', "Course", "ProgramCourse", "Enrollment", 'Role', 'RoleMapping'], function (err) {
    if(err){
      throw new Error(err);
    }

    var Role = app.models.Role;
    var Program = app.models.Program;

    console.log('tables migrated');
    async.series([
      migratePrograms,
      migrateRoles,
      migrateCourses,
      migrateStudents,
      migrateTeachers
    ], function (err) {
      if(err){
        throw new Error(err);
      }

      console.log('db migrated');
    });

    function migratePrograms(cb) {
      Program.create([{
        name: 'math'
      }, {
        name: 'linquistics'
      }], function (err) {
        cb(err);
      });
    }

    function migrateRoles(cb) {
      Role.create({
        name: 'admin'
      }, function(err, adminRole){
        if(err){
          return cb(err);
        }

        app.models.MyUser.create({
          username: 'voislav',
          email: 'voislav.mishevski@it-labs.com',
          password: 'voislav'
        }, function(err, user){
          if(err){
            return cb(err);
          }
          adminRole.principals.create({
            principalType: app.models.RoleMapping.USER,
            principalId: user.id
          }, function(err){
            cb(err);
          });
        });
      });
    }

    function migrateCourses(cb) {
      async.series([
        function mathCourses(innerCb){
          app.models.Program.find({where: {name: 'math'}}, function (err, programs) {
            if(err){
              return cb(err);
            }

            if(!programs.length){
              return cb(new Error('program with name math not found'))
            }

            var program = programs[0];

            console.log('program found', program);

            program.courses.create([{
              name: 'math I'
            }, {
              name: 'math II'
            }, {
              name: 'math III'
            }], function (err) {
              innerCb(err);
            });
          });
        },
        function linguisticsCourses(innerCb){
          app.models.Program.find({where: {name: 'linquistics'}}, function (err, programs) {
            if(err){
              return cb(err);
            }

            if(!programs.length){
              return cb(new Error('program with name math not found'))
            }
            var program = programs[0];

            console.log('program found', program);

            program.courses.create([{
              name: 'english'
            }, {
              name: 'french'
            }, {
              name: 'russian'
            }], function (err) {
              innerCb(err);
            });
          });
        }
      ], function(err){
        cb(err);
      });

    }

    function migrateStudents(cb){
      app.models.Student.create([{
        name: 'student one',
        email: 'student-one@yopmail.com',
        password: 'student'
      }, {
        name: 'student two',
        email: 'student-two@yopmail.com',
        password: 'student'
      }], function (err, students) {
        if(err){
          return cb(err);
        }

        app.models.Course.find({where: {name: 'math I'}}, function(err, courses){
          if(err){
            return cb(err);
          }

          if(!courses.length){
            return cb(new Error('math I course not found'));
          }

          var mathOne = courses[0];
          async.series([
            function(innerCb){
              var student = students[0];
              var enrollment = student.enrollments.build({
                dateEnrolled: new Date()
              });

              student.enrollments.create(enrollment, function (err) {
                innerCb(err);
              });
            },
            // function (innerCb) {
            //   students[1].courses.add(mathOne, function (err) {
            //     innerCb(err);
            //   })
            // }
          ], function (err) {
            cb(err);
          });
        });

      });
    }

    function cmigrateTeachers(cb){
      app.models.Teacher.create({
        name: 'Math teacher'
      }, function (err, teacher) {
        if(err){
          return cb(err);
        }

        
      })
    }
  })
};
