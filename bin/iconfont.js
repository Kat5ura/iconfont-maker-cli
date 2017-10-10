#!/usr/bin/env node

var package = require('../package.json');
var program = require('commander');

program
    .version(package.version)
	.usage('[command] [options]')
    .command('make [from] [to]', 'Generate iconfonts base on given svg-icon images', {isDefault: true})
    .parse(process.argv);
