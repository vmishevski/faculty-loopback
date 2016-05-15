/**
 * Created by Voislav on 5/15/2016.
 */

module.exports = function (app) {
  var mysql = app.datasources.mysql;

  mysql.automigrate(['MyUser', 'Student', 'Teacher', 'Program', 'ProgramEnrollment', "Course", "ProgramCourse", "Enrollment"], function (err) {
    if(err){
      throw new Error(err);
    }

    console.log('db migrated');
  })
};
