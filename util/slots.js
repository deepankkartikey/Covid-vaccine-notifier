const axios = require('axios');
const Table = require('tty-table');
const chalk = require('chalk');
const inquirer = require('inquirer');
const notifier = require('node-notifier');
const { config, options } = require('./config');
require('dotenv').config();
const fast2sms = require('fast-two-sms');

const getSlotsByPinCodeUrl =
	'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin';

const header = [
	{
		value: 'center',
		headerColor: 'cyan',
		color: 'white',
		align: 'left',
		width: 30,
		alias: 'Center Name',
	},
	{
		value: 'address',
		color: 'red',
		width: 25,
		alias: 'Center Address',
	},
	{
		value: 'available_slots',
		color: 'red',
		width: 25,
		alias: 'Available Slots',
	},
	{
		value: 'age',
		color: 'red',
		width: 5,
		alias: 'Age',
	},
	{
		value: 'date',
		color: 'red',
		width: 15,
		alias: 'Date',
	},
];

module.exports = function (pinCode, date) {
	var todayDate;
	if (date == '') {
		todayDate = new Date();
	} else {
		todayDate = new Date(date);
	}
	var dd = String(todayDate.getDate()).padStart(2, '0');
	var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = todayDate.getFullYear();
	var formattedDate = `${dd}-${mm}-${yyyy}`;
	console.log(formattedDate);
	inquirer
		.prompt([
			{
				type: 'list',
				name: 'choice',
				message: 'Please choose age group',
				choices: [
					{
						name: 'All ages',
						value: '',
					},
					{
						name: '45+',
						value: '45',
					},
					{
						name: '18-45',
						value: '18',
					},
				],
			},
		])
		.then(answers => {
			//console.log(answers);
			makeGetRequest(pinCode, formattedDate, answers);
		});
};

function makeGetRequest(pinCode, formattedDate, answers) {
	axios
		.get(
			getSlotsByPinCodeUrl + `?pincode=${pinCode}&date=${formattedDate}`,
			config
		)
		.then(function (response) {
			//console.log(response.data.sessions);
			const centerData = response.data.sessions;
			var finalData = [];
			var districtName;
			// const availableCenters = Table(header, centerData, options).render();
			centerData.forEach(item => {
				//console.log(item);
				if (answers.choice == '') {
					let ourData = {
						center: item.name,
						address: item.address,
						available_doses: item.available_capacity,
						dose1: item.available_capacity_dose1,
						dose2: item.available_capacity_dose2,
						age: item.min_age_limit,
						date: item.date,
						available_slots: item.slots,
					};
					finalData.push(ourData);
				} else if (answers.choice == item.min_age_limit) {
					let ourData = {
						center: item.name,
						address: item.address,
						available_doses: item.available_capacity,
						dose1: item.available_capacity_dose1,
						dose2: item.available_capacity_dose2,
						age: item.min_age_limit,
						date: item.date,
						available_slots: item.slots,
					};
					finalData.push(ourData);
				}
			});
			if (finalData.length == 0) {
				console.log(`NO Slot available in ${pinCode} for selected age-group`);
			}
			const finalSlotData = Table(header, finalData, options).render();
			console.log(
				chalk.blue.bgWhite.bold(`Date for which run --> ${formattedDate}`)
			);
			console.log(chalk.blue.bgWhite.bold(`Pincode--> ${pinCode}`));
			//console.log(finalSlotData);
			finalData.forEach(data => {
				console.log(data);
				if (data.available_doses > 0) {
					var message = createMessage(data);
					notifyOnDesktop(message);
					// notifyOnSMS(message);
				}
			});
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {});
}

function createMessage(data) {
	return `Center:${data.center} 
Address:${data.address} 
Age: ${data.age} 
Available doses: ${data.available_doses} 
Available slots: ${data.available_slots}`;
}

function notifyOnDesktop(message) {
	notifier.notify({
		title: 'Vaccine Slot available',
		message: `${message}`,
		wait: true,
	});
}

function notifyOnSMS(message) {
	var options = {
		authorization: process.env.API_KEY,
		message: `${message}`,
		numbers: ['8851849428'],
	};
	fast2sms.sendMessage(options);
}
