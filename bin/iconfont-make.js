#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');

const maker = require('iconfont-maker');


let cwd = process.cwd();

program
	.usage('[from] [to]')
	.description('Make your own IconFont from svg icons')
	.option('-c, --config <c>', 'Use a config file')
	.option('-n, --font-name <n>', 'Specify a custom font name')
	.option('-s, --css', 'Generate css file, true by default', trueDefaultProcessor)
	.option('-d, --css-dest <d>', 'Specify a custom destination for css file')
	.option('-H, --html', 'Generate an html file for test', htmlProcessor)
	.option('-D, --html-dest <d>', 'Specify a custom destination for html file')
	.option('-t, --types <t>', 'Font types to generate, default is [woff2, woff, eot]', typeProcessor)
	.option('-o, --optimize', 'Enable svg optimization with svgo, default is true', trueDefaultProcessor)
	.option('-P, --svgo-plugins <l>', 'Plugins list for svgo, "plugin1,!plugin2", use "!" to turn off', pluginProcessor)
	.arguments('[from] [to]')
	.action(function (from, to, opts) {
		console.log(chalk.grey('Starting...'));
		let sourceFiles = from ? path.resolve(cwd, from) : '';
		let targetDir = to ? path.resolve(cwd, to) : '';

		if (!sourceFiles || !targetDir) {
			console.log(chalk.red('Invalid source or target'));
			return;
		}

		let fontName = opts.fontName || 'iconfont';
		let css = opts.css === undefined || opts.css;
		let cssDest = opts.cssDest ? path.join(path.resolve(cwd, opts.cssDest), fontName + '.css') : undefined;

		let html = opts.html === undefined || opts.html;
		let htmlDest = opts.htmlDest ? path.join(path.resolve(cwd, opts.htmlDest), fontName + '.html') : undefined;

		let types = (opts.types && opts.types.length) ? opts.types : undefined;

		let cssFontsUrl = path.relative(path.resolve(cwd, opts.cssDest), targetDir);

		let optimize = opts.optimize === undefined || opts.optimize;

		let plugins = opts.svgoPlugins || {};

		let options = {
			fontName,
			css,
			cssDest,
			html,
			htmlDest,
			types,
			cssFontsUrl,
			optimize,
			svgo: {
				plugins
			}
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
			if (options[key] === undefined) {
				delete options[key];
			}
		});

		maker(options, err => {
			if (!err) console.log(chalk.green('Done!'));
		});
	});

program.on('--help', function () {
	console.log('');
	console.log('  Examples:');
	console.log();
	console.log(chalk.gray('    # Make your own iconfonts'));
	console.log('    $ iconfont make ./icons/*.svg ./fonts/');
});

program.parse(process.argv);

if (program.args.length < 1 || program.options.length < 1) return program.help();

function trueDefaultProcessor (css) {
	return css !== 'false';

}

function htmlProcessor () {
	return true;
}

function typeProcessor (types) {
	return types.split(',');
}

function pluginProcessor (plugins) {
	let p = {};
	plugins.split(',').forEach(plugin => {
		if (plugin[0] === '!') {
			p[plugin.slice(1)] = false
		} else {
			p[plugin] = true
		}

	});

	return p;
}



