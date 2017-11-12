	
/**
	cnpm init --yes
	cnpm i gulp --save-dev
	cnpm i
	gulp default
	git init
	git add --all
	git commit -m '描述信息'(
		github仓库地址；
		git remote add 名称 地址;
		git remote -v 查看远程仓库的配置信息；
		git push -u 远程仓库信息 master;
		.......git clone   git pull
	)
 */

/**
	gulp
	gulp-htmlmin    做html代码压缩 和格式化   ==>  代码格式化
	gulp-less		让gulp 工作流可以完成  LESS的编译 生成CSS文件
	gulp-cssmin		css压缩
	gulp-concat		文件合并
	gulp-uglify		js的压缩和混淆
	gulp-autoprefixer  自动前缀功能
	gulp-imagemin		图片压缩

	gulp-plumber	处理代码错误的==> 让GULP工作流不会因为代码错误 主动退出

	gulp-load-plugins   自动模块加载  只是根据 package.json中的模块信息，自动进行读取
						只会加载 以 gulp- 开头的组件
						该组件引入后需要被调用
						会返回一个对象， 通过对象的key 值进行获取   组件名称删除gulp-


	gulp-clean      提供一个手动清除功能


	browser-sync    浏览器同步组件   多数工作流都可以使用的组件


	
*/

// 加载模块
// ES6 语法中的要求 ==> 一个变量在整个使用过程中，不会再发生变化  使用 常量 
const gulp = require("gulp");

const gulpLoadPlugins = require("gulp-load-plugins");  // 使用 $ 定义的变量一般作用工具类使用
const $ = gulpLoadPlugins();

// 浏览器同步对象需要被初始化
//    在默认任务中进行初始化
const browsersync = require("browser-sync").create();


// 创建一个变量 进行目录的存放
const app = {
	srcPath:"src/",     //  开发目录
	devPath:"build/",   //  开发成品目录
	prPath:"dist/"     //  测试目录
	
};

// 清除工具
gulp.task("clean",()=>{
	// gulp.src()   可以接受一个数组参数，定义多了路径
	gulp.src([app.devPath,app.prPath])
		.pipe($.clean());
});


// 1、html 编译 和 压缩
gulp.task("html",()=>{
	//   *   任意文件名
	//   **  任意目录
	gulp.src(app.srcPath+"**/*.html")
		// 先做错误处理
		.pipe($.plumber())
		// 完成一次开发成品备份
		.pipe(gulp.dest(app.devPath))
		// 代码处理   gulp-htmlmin
		.pipe($.htmlmin({
			collapseWhitespace:true,   //删除空格
			removeComments:true       //删除注释
		}))
		.pipe(gulp.dest(app.prPath))
		// 增减浏览器同步代码
		.pipe(browsersync.stream());
});


// 3、css 的处理
gulp.task("css",()=>{
	gulp.src(app.srcPath+"**/*.css")
		.pipe($.plumber())
		.pipe(gulp.dest(app.devPath))
		.pipe($.autoprefixer({
			browsers:["last 20 versions"],  //兼容最近 主流浏览的  20个版本   理论上：可以没有上限
			cascade:true   //  是否自动美化属性  默认值 true
		}))
		// css的压缩
		.pipe($.cssmin())
		.pipe(gulp.dest(app.prPath))
		// 增减浏览器同步代码
		.pipe(browsersync.stream());
});

gulp.task("js",()=>{
	gulp.src(app.srcPath+"**/*.js")
		.pipe($.plumber())
		.pipe(gulp.dest(app.devPath))
		.pipe($.concat("all.js"))
		.pipe($.uglify())
		.pipe(gulp.dest(app.prPath))
		// 增减浏览器同步代码
		.pipe(browsersync.stream());
});




// 定义一个自动任务
gulp.task("watch",()=>{
	// 监视器   回去实时的监视文件的变化，当文件发生变化是自动执行对应的工作流
	// gulp.watch(path,[任务名])
	gulp.watch(app.srcPath+"**/*.html",["html"]);
	// 可以配置多个监视任务
	gulp.watch(app.srcPath+"**/*.css",["css"]);
	gulp.watch(app.srcPath+"**/*.js",["js"]);
});


// gulp 中有一个默认任务  任务名不可以修改  default
//     定义和该任务有关的所有任务
gulp.task("default",["html","css","js","watch"],()=>{
	browsersync.init({
		// 需要指定 同步时的 根目录
		server:{
			baseDir:app.prPath
		}
	})
});

















