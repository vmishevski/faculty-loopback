/**
 * Created by Voislav on 5/15/2016.
 */
module.exports = function(app) {
  var Role = app.models.Role;
  Role.registerResolver('isTeacher', function(role, context, cb) {
    function reject(err) {
      if(err) {
        return cb(err);
      }
      cb(null, false);
    }

    if (context.modelName !== 'Enrollment') {
      console.log('model ' + context.modelName + ' is not CourseEnrollment, not a teacher');
      // the target model is not project
      return reject();
    }
    var userId = context.accessToken.userId;
    if (!userId) {
      console.log('user not authenticated');
      return reject(); // do not allow anonymous users
    }

    if(!context.modelId){
      return reject();
    }

    // check if userId is in team table for the given project id
    context.model.findById(context.modelId, function(err, courseEnrollment) {
      if(err || !courseEnrollment) {
        console.log('courseEnrollment not found');
        return reject(err);
      }

      console.log('found courseEnrollment ', courseEnrollment);

      courseEnrollment.course(function (err, course) {
        if(err){
          return reject(err);
        }

        console.log(course.id == userId ? 'user is teacher' : 'user not teacher of the course');

        return cb(null, course.id == userId);
      });

    });
  });
};
