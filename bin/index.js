#! /usr/bin/env node

const states = require('../util/states');
const districts = require('../util/districts');
const slots = require('../util/slots');
const program = require('commander');
const schedule = require('node-schedule');

program
	.command('slot <pincode> <date>')
	.description(
		'get list of all available slots by pincode and date (mm-dd-yyyy)'
	)
	.action(slots);
// slots(15);
program.parse();

// schedule job at regular intervals
//schedule.scheduleJob('*/1 * * * *', () => {
//slots();
//program.parse();
//});
