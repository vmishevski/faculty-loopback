module.exports = function(Enrollment) {
  Enrollment.beforeRemote('create', function(ctx, next){
    var data = ctx.args.data;

    data.dateEnrolled = new Date();

    next();
  });
};
