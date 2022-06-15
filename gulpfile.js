var gulp = require("gulp")
var autoprefixer = require("gulp-autoprefixer")
const { versions } = require("process")

gulp.task("styles-header",()=>{
    return gulp.src('styles/header.css')
                .pipe(autoprefixer({
                    browsers:['last 99 versions'],
                    cascade:false
                }))
                .pipe(gulp.dest("styles-build"))
})

gulp.task("styles-main",()=>{
    return gulp.src('styles/main.css')
                .pipe(autoprefixer({
                    browsers:['last 99 versions'],
                    cascade:false
                }))
                .pipe(gulp.dest("styles-build"))
})

gulp.task("styles-hero",()=>{
    return gulp.src('styles/hero.css')
                .pipe(autoprefixer({
                    browsers:['last 99 versions'],
                    cascade:false
                }))
                .pipe(gulp.dest("styles-build"))
})

gulp.task('watch',()=>{
    gulp.watch('styles/header.css', gulp.series('styles-header'))
    gulp.watch('styles/main.css', gulp.series('styles-main'))
    gulp.watch('styles/hero.css', gulp.series('styles-hero'))
})