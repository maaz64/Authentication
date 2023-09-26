const gulp = require('gulp');
const cssnano = require('gulp-cssnano');


gulp.task('css',function(done){
    console.log('minifying css...');
    gulp.src('./assets/css/**/*.css')
    .pipe(cssnano())
    .pipe(gulp.dest('./public/assets/css'));
    done();

});


gulp.task('watch',()=>{
   return gulp.watch('./assets/css/**/*.css',()=>{
    gulp.series(['css'])
   })
})