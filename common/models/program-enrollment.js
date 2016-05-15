module.exports = function(ProgramEnrollment) {
  ProgramEnrollment.beforeRemote('create', function(ctx, next){
    var data = ctx.args.data;

    data.dateEnrolled = new Date();

    next();
  });
};
