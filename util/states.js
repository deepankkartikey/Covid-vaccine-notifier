const axios = require('axios');
const Table = require('tty-table');
const { options, config } = require('./config');
const getStatesUrl = 'https://cdn-api.co-vin.in/api/v2/admin/location/states';

const header = [
	{
		value: 'state_id',
		headerColor: 'cyan',
		color: 'white',
		align: 'left',
		width: 10,
		alias: 'State ID',
	},
	{
		value: 'state_name',
		color: 'red',
		width: 25,
		alias: 'State Name',
	},
];

module.exports = function () {
	axios
		.get(getStatesUrl, config)
		.then(function (response) {
			// handle success
			// console.table(response.data.states);
			const statesDataVar = response.data.states;
			const statesOut = Table(header, statesDataVar, options).render();
			console.log(statesOut);
		})
		.catch(function (error) {
			// handle error
			console.log(error);
		})
		.then(function () {
			// always executed
		});
};
