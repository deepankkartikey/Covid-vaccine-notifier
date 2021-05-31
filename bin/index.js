#! /usr/bin/env node

const states = require('../util/states');
const districts = require('../util/districts');
const slots = require('../util/slots');
const program = require('commander');

program.command('states').description('get list of all states').action(states);
// states();
program
	.command('districts <stateid>')
	.description('get list of all districts by stateid')
	.action(districts);
// districts(1);
program
	.command('slot <districtid>')
	.description('get list of all available slots by districtid')
	.action(slots);
// slots(15);
program.parse();
