let outputDirectoryName = 'output';
let imageDirectoryName = 'images';
let outputTSFileName = 'main.ts';
let typescriptDirectoryName = 'typescripts';
let stylesDirectoryName = 'styles';
let outputStyleFileName = 'styles.scss';
let outputCSSFileName = 'styles.css';
let templateDirectoryName = 'htmls';

(function mergeTSFilesToMainTS() {
	console.log('***** Merging all ts files to a single file "' + outputDirectoryName + '/' + outputTSFileName + '" *****');
	const path = require('path');
	const fs = require('fs');
	const directoryPath = path.join(__dirname, typescriptDirectoryName);
	filenames = fs.readdirSync(directoryPath);
	let totalScript = '';
	filenames.forEach(fileName => {
		let content = fs.readFileSync(typescriptDirectoryName + "/" + fileName, 'utf-8');
		totalScript += content;
	});
	fs.writeFileSync(outputDirectoryName + '/' + outputTSFileName, totalScript);
})();

(function buildTemplate() {
	console.log('***** Merging all templates from html file to "' + outputDirectoryName + '/' + outputTSFileName + '" *****');
	const path = require('path');
	const fs = require('fs');
	const directoryPath = path.join(__dirname, templateDirectoryName);
	filenames = fs.readdirSync(directoryPath);
	filenames.forEach(fileName => {
		let template = fs.readFileSync(templateDirectoryName + "/" + fileName, 'utf-8');
		let mainTS = fs.readFileSync(outputDirectoryName + '/' + outputTSFileName, 'utf-8');
		mainTS = mainTS.replace(templateDirectoryName + "/" + fileName, template);
		fs.writeFileSync(outputDirectoryName + '/' + outputTSFileName, mainTS);
	});
})();

(function buildFinalJSFromMainTS() {
	console.log('***** Compiling file "' + outputDirectoryName + '/' + outputTSFileName + '" *****');
	const { exec } = require("child_process");
	exec('tsc ' + outputDirectoryName + '/' + outputTSFileName, function (error) {
		if (error === null) {
			const fs = require('fs');
			try {
				let outputJSFileName = outputTSFileName.split('.ts').join('.js');
				let outputJSMinFileName = outputTSFileName.split('.ts').join('.min.js');
				exec('uglifyjs '+outputDirectoryName + '/' + outputJSFileName+' -o '+outputDirectoryName + '/' + outputJSMinFileName);
				fs.unlinkSync('./' + outputDirectoryName + '/' + outputTSFileName)
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log(error);
		}
	});
})();

(function mergeSCSSFilesToMainScss() {
	console.log('***** Merging all scss files to a single file "' + outputDirectoryName + '/' + outputStyleFileName + '" *****');
	const path = require('path');
	const fs = require('fs');
	const directoryPath = path.join(__dirname, stylesDirectoryName);
	filenames = fs.readdirSync(directoryPath);
	let totalScript = '';
	filenames.forEach(fileName => {
		let content = fs.readFileSync(stylesDirectoryName + "/" + fileName, 'utf-8');
		totalScript += content;
	});
	fs.writeFileSync(outputDirectoryName + '/' + outputStyleFileName, totalScript);
})();

(function buildFinalCSSFromMainSCSS() {
	console.log('***** Compiling file "' + outputDirectoryName + '/' + outputStyleFileName + '" *****');
	const { exec } = require("child_process");
	exec('node-sass ' + outputDirectoryName + '/' + outputStyleFileName + ' ' + outputDirectoryName + '/' + outputCSSFileName, (error) => {
		if (error === null) {
			const fs = require('fs');
			try {
				fs.unlinkSync('./' + outputDirectoryName + '/' + outputStyleFileName)
			} catch (error) {
				console.log(error);
			}
		} else {
			console.log(error);
		}
	});
})();

(function copyImagesToOutputDirectory() {
	const fse = require('fs-extra');
	fse.copySync('./'+imageDirectoryName, './'+outputDirectoryName+'/'+imageDirectoryName);
})();