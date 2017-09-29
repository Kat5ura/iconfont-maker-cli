#!/usr/bin/env node

var package = require('../package.json');
var program = require('commander');
var inquirer = require('inquirer');
var chalk = require('chalk');

program
    .version(package.version)
    .command('make [from] [to]', 'Generate iconfonts base on given svg-icon images', {isDefault: true})
    .parse(process.argv);
