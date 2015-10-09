/// <reference path="../../typings/angular2/angular2.d.ts" />
'use strict';
import {Component, View} from 'angular2/angular2';
import {Router} from 'angular2/router';
import {SalesGraph} from './salesgraph/salesgraph';
@Component({
	selector: 'salesforce-widget'
})
@View({
	templateUrl: './jsts/components/salesforce/salesforce.html',
	styleUrls: ['./jsts/components/salesforce/salesforce.css'],
	directives: [SalesGraph]
})
export class SalesforceWidget {
	graphData: any;
	// constructor
	promiseGenforSKUSales(sku) {
		// check if there is a jwt
		const jwt = localStorage.getItem('jwt');
		return window.fetch('https://' + location.host + '/inventmanapi/getsales/' + sku, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + jwt
			}
		}).then(response => {
			// convert to Text
			return response.json();
		}).then(skusalesdata => {
			// sorts the data
			for (let data of skusalesdata) {
				// converts the string to Javascript Date
				data._id = new Date(Date.parse(data._id));
			}
			// sort the array according to the date
			skusalesdata.sort((a, b) => {
				let c: any = new Date(a._id);
				let d: any = new Date(b._id);
				return c - d;
			});
			// return the generated array
			return skusalesdata;
		}).catch(error=> {
			throw error;
		});
	}
	constructor(public router: Router) {
		let tempData = [];
		console.log('Constructing the initial Cumulative Sales Data...');
		// check if there is a jwt
		const jwt = localStorage.getItem('jwt');
		// checks for the local jwt token and calls the api on URL change
		if (jwt) {
			// start the actual thing
			window.fetch('https://' + location.host + '/inventmanapi/getsales/all', {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + jwt
				}
			}).then(response => {
				// convert to Text
				return response.json();
			}).then(fullsalesdata => {
				// sorts the data
				for (let data of fullsalesdata) {
					// converts the string to Javascript Date
					data._id = new Date(Date.parse(data._id));
				}
				// sort the array according to the date
				fullsalesdata.sort((a, b) => {
					let c: any = new Date(a._id);
					let d: any = new Date(b._id);
					return c - d;
				});
				// push into temporary array
				tempData.push("Cumulative Aggregated Sales");
				tempData.push(fullsalesdata);
				// get the top 10 SKUs for this week as they are most relevant
				let top10skus = window.fetch('https://' + location.host + '/inventmanapi/getsales/top10master/7', {
					method: 'GET',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + jwt
					}
				}).then(response => {
					// convert to Text
					return response.json();
				}).catch(error=> {
					console.log(error.message);
					// remove jwt for security purpose
					localStorage.removeItem('jwt');
					// navigate to login
					this.router.navigateByUrl('/login');
				});
				// resolve the promise
				Promise.resolve(top10skus).then(skus=> {
					let justSKUS = []
					for (let sku of skus) {
						justSKUS.push(sku._id.sku);
					}
					return justSKUS;
				}).then(skus=> {
					// generate promises to fetch data for other sales
					let promisegenArray = [];
					for(let sku of skus){
						promisegenArray.push(this.promiseGenforSKUSales(sku));
					}
					// parse all promises
					Promise.all(promisegenArray).then(result2=>{
						for(let i=0;i<skus.length;i++){
							tempData.push(skus[i]);
							tempData.push(result2[i]);
						}
						console.log('All sales data pulled...');
						// finally reassign the tempdata to graphData
						this.graphData=tempData;
					}).catch(error=>{
						throw error;
					})
				}).catch(error=> {
					throw error;
				});
			}).catch(error=> {
				console.log(error.message);
				// remove jwt for security purpose
				localStorage.removeItem('jwt');
				// navigate to login
				this.router.navigateByUrl('/login');
			});
		}
		else {
			// remove the JWT
			localStorage.removeItem('jwt');
			// there is no jwt at all so navigate to login
			this.router.navigateByUrl('/login');
		}
	}
}