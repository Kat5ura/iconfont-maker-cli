#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');

const maker = require('iconfont-maker');


let cwd = process.cwd();

program
    .usage('[from] [to]')
    .description('Make your own iconfonts')
    .option('-c, --config <c>', 'Use a config file')
	.option('-n, --font-name <n>', 'Specify a custom font name')
	.option('-s, --css', 'Generate css file', cssProcessor)
	.option('-d, --css-dest <d>', 'Specify a custom destination for css file')
	.option('-h, --html', 'Generate an html file for test', htmlProcessor)
	.option('-D, --html-dest <d>', 'Specify a custom destination for html file')
	.option('-t, --types <t>', 'Font types to generate', typeProcessor)
    .arguments('[from] [to]')
    .action(function (from, to, opts) {
	    let sourceFiles = path.resolve(cwd, from);
	    let targetDir = to ? path.resolve(cwd, to) : '';

	    let fontName = opts.fontName || 'iconfont';
	    let css = opts.css === undefined || opts.css;
	    let cssDest = opts.cssDest ? path.join(path.resolve(cwd, opts.cssDest), fontName + '.css') : undefined;

	    let html = opts.css === undefined || opts.html;
	    let htmlDest = opts.htmlDest ? path.join(path.resolve(cwd, opts.htmlDest), fontName + '.html') : undefined;

	    let types = (opts.types && opts.types.length) ? opts.types : undefined;

	    let cssFontsUrl = path.relative(path.resolve(cwd, opts.cssDest), targetDir)

	    let options = {
	    	fontName,
		    css,
		    cssDest,
		    html,
		    htmlDest,
		    types,
		    cssFontsUrl,
		    normalize: true
	    };

	    if (!opts.config) {
		    if (!sourceFiles) {
			    console.log(chalk.red('You must specify your icons to be transformed'));
			    return;
		    }

		    if (!targetDir) {
			    console.log(chalk.red('You must specify an output path'));
			    return;
		    }

		    if (!fs.existsSync(targetDir)) {
			    fs.mkdirSync(targetDir);
		    }

		    options.files = sourceFiles;
		    options.dest = targetDir;
	    } else {
		    let configFile = path.resolve(cwd, opts.config);

		    if (!fs.existsSync(configFile)) {
			    console.log(chalk.red('Cannot locate your config file, please try again'));
			    return;
		    }

		    let configStr = fs.readFileSync(configFile, {encoding: 'utf8'});

		    let config = null;

		    try {
			    config = JSON.parse(configStr);
		    } catch (err) {
			    console.error(err);
			    config = {};
		    }

		    options = Object.assign({files: '', dest: ''}, options, config);
	    }

	    if (!options.files || !options.dest) {
		    console.log(chalk.red('Invalid source or target'));
		    return;
	    }

	    Object.keys(options).forEach(key => {
	    	if(options[key] === undefined){
	    		delete options[key]
		    }
	    });

	    maker(options);
    });

program.on('--help', function () {
    console.log('');
    console.log('  Examples:');
    console.log();
    console.log(chalk.gray('    # Make your own iconfonts'));
    console.log('    $ iconfont make ./icons/*.svg ./fonts/');
});

program.parse(process.argv);

if (program.args.length < 1 && program.options.length < 1) return program.help();

function cssProcessor (css) {
	return css !== 'false';

}

function htmlProcessor () {
	return true;
}

function typeProcessor (types) {
	console.log('types: '+ types)
	return types.split(',');
}



