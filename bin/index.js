#! /usr/bin/env node

const states = require('../util/states');
const districts = require('../util/districts');
const slots = require('../util/slots');
const program = require('commander');

program.command('states').description('get list of all states').action(states);

program
	.command('districts <stateid>')
	.description('get list of all districts by stateid')
	.action(districts);

program
	.command('slot <districtid>')
	.description('get list of all available slots by districtid')
	.action(slots);

program.parse();

// states();
// districts(1);
// slots(15);
