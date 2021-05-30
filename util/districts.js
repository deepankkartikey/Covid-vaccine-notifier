const axios = require('axios');
const Table = require('tty-table');
const { options, config } = require('./config');

const header = [
	{
		value: 'district_id',
		headerColor: 'cyan',
		color: 'white',
		align: 'left',
		width: 10,
		alias: 'District ID',
	},
	{
		value: 'district_name',
		color: 'red',
		width: 25,
		alias: 'District Name',
	},
];

const getDistrictsUrl =
	'https://cdn-api.co-vin.in/api/v2/admin/location/districts/';

module.exports = function (state_id) {
	axios
		.get(getDistrictsUrl + state_id, config)
		.then(function (response) {
			const districtPerStateId = response.data.districts;
			const districtOut = Table(header, districtPerStateId, options).render();
			console.log(districtOut);
		})
		.catch(function (error) {
			console.log(error);
		});
};
