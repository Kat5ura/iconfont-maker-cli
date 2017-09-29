#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const chalk = require('chalk');

const maker = require('iconfont-maker');


let sourceFiles = '';
let targetDir = '';
let cwd = '';

program
    .usage('[from] [to]')
    .description('Make your own iconfonts')
    .option('-c, --config <c>', 'Use a config file')
    .arguments('[from] [to]')
    .action(function (form, to) {
        cwd = process.cwd();
        sourceFiles = path.resolve(cwd, form);
        targetDir = to ? path.resolve(cwd, to) : '';
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

let options = {};

if (!program.config) {
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
    let configFile = path.resolve(cwd, program.config);

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

maker(options);





