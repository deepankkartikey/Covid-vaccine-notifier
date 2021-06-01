const axios = require('axios');
const Table = require('tty-table');
const chalk = require('chalk');
const inquirer = require('inquirer');
const notifier = require('node-notifier');

const { config, options } = require('./config');

const getSlotsByDistrictUrl =
	'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict';

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
		value: 'available',
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

module.exports = function (districtId) {
	var todayDate = new Date();
	var dd = String(todayDate.getDate()).padStart(2, '0');
	var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = todayDate.getFullYear();
	var formattedDate = `${dd}-${mm}-${yyyy}`;
	//console.log(formattedDate);
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
			console.log(answers);
			makeGetRequest(districtId, formattedDate, answers);
		});
};

function makeGetRequest(districtId, formattedDate, answers) {
	axios
		.get(
			getSlotsByDistrictUrl +
				`?district_id=${districtId}
            &date=${formattedDate}`,
			config
		)
		.then(function (response) {
			const centerData = response.data.centers;
			var finalData = [];
			var districtName;
			// const availableCenters = Table(header, centerData, options).render();
			centerData.forEach(item => {
				districtName = item.district_name;
				item.sessions.forEach(session => {
					if (answers.choice == '') {
						let ourData = {
							center: item.name,
							address: item.address,
							available: session.available_capacity,
							age: session.min_age_limit,
							date: session.date,
							dose1: session.available_capacity_dose1,
							dose2: session.available_capacity_dose2,
						};
						finalData.push(ourData);
					} else if (answers.choice == session.min_age_limit) {
						let ourData = {
							center: item.name,
							address: item.address,
							available: session.available_capacity,
							age: session.min_age_limit,
							date: session.date,
							dose1: session.available_capacity_dose1,
							dose2: session.available_capacity_dose2,
						};
						finalData.push(ourData);
					}
				});
			});
			const finalSlotData = Table(header, finalData, options).render();
			console.log(
				chalk.blue.bgWhite.bold(`Date for which run --> ${formattedDate}`)
			);
			console.log(chalk.blue.bgWhite.bold(`District--> ${districtName}`));
			//console.log(finalData);
			finalData.forEach(data => {
				if (data.available > 0) {
					notifier.notify({
						title: 'Vaccine Slot available',
						message: `District Name: ${districtName} 
Center:${data.center} 
Address:${data.address} 
Age: ${data.age} 
Available doses: ${data.available}`,
						wait: true,
					});
				}
			});
		})
		.catch(function (error) {
			console.log(error);
		})
		.then(function () {});
}
