// Импорт основного модуля
import gulp from "gulp";
// Импорт общих плагинов
import { plugins } from "./config/gulp-plugins.js";
// Импорт путей
import { path } from "./config/gulp-settings.js";

// Передаем значения в глобальную переменную
global.app = {
	isBuild: process.argv.includes("--build"),
	isDev: !process.argv.includes("--build"),
	isWebP: !process.argv.includes("--nowebp"),
	isFontsReW: process.argv.includes("--rewrite"),
	gulp: gulp,
	path: path,
	plugins: plugins,
};

import { css } from "./config/gulp-tasks/css.js";
import { copyExistingWoff, fonstStyle } from "./config/gulp-tasks/fonts.js";
import { ftp } from "./config/gulp-tasks/ftp.js";
import { gitignore } from "./config/gulp-tasks/gitignore.js";
import { html } from "./config/gulp-tasks/html.js";
import { images } from "./config/gulp-tasks/images.js";
import { jsDev } from "./config/gulp-tasks/js-dev.js";
import { js } from "./config/gulp-tasks/js.js";
// Импорт задач
import { reset } from "./config/gulp-tasks/reset.js";
import { sprite } from "./config/gulp-tasks/sprite.js";
import { zip } from "./config/gulp-tasks/zip.js";

const fonts = gulp.series(reset, copyExistingWoff, fonstStyle);
// Основные задачи будем выполнять параллельно после обработки шрифтов
const devTasks = gulp.parallel(fonts, gitignore);
// Основные задачи будем выполнять параллельно после обработки шрифтов
const buildTasks = gulp.series(
	fonts,
	jsDev,
	js,
	gulp.parallel(html, css, images, gitignore),
);

// Экспорт задач
export { css, fonts, ftp, html, images, js, jsDev, sprite, zip };

// Построение сценариев выполнения задач
const development = gulp.series(devTasks);
const build = gulp.series(buildTasks);
const deployFTP = gulp.series(buildTasks, ftp);
const deployZIP = gulp.series(buildTasks, zip);

// Экспорт сценариев
export { build, deployFTP, deployZIP, development };

// Выполнение сценария по умолчанию
gulp.task("default", development);
