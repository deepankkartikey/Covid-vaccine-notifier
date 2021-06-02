#! /usr/bin/env node

const states = require('../util/states');
const districts = require('../util/districts');
const slots = require('../util/slots');
const program = require('commander');
const schedule = require('node-schedule');

program.command('states').description('get list of all states').action(states);
// states();
program
	.command('districts <stateid>')
	.description('get list of all districts by stateid')
	.action(districts);
// districts(1);
program
	.command('slot <pincode>')
	.description('get list of all available slots by pincode')
	.action(slots);
// slots(15);
program.parse();

// schedule job at regular intervals
//schedule.scheduleJob('*/10 * * * * *', () => {
//	slots(157);
//});
