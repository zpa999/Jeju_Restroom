import axios from 'axios';
import fs from 'fs';

const encodedKey = 'ZbXsrscdNlfKHPjUNz3BXsGPGy75wtrFiWv8HuARD%2F%2BDAiNRC9%2FS1u6FwFLw96riwDtcTSemOrDLsSjQNOVcvg%3D%3D';
const key = decodeURIComponent(encodedKey);

const orgCodes = ['6510000', '5050000', '6500000', '6520000'];
const services = ['publicToiletService', 'publicRestroomService', 'restroomService', 'toiletService'];
const operations = ['getRestroomInfoList', 'getPublicToiletInfoList', 'getToiletInfoList', 'getRestroomList'];

const endpoints = [];

orgCodes.forEach(org => {
    services.forEach(svc => {
        operations.forEach(op => {
            endpoints.push(`http://apis.data.go.kr/${org}/${svc}/${op}`);
        });
    });
});

async function testEndpoints() {
    let output = '';
    console.log(`Testing ${endpoints.length} endpoints...`);
    for (const url of endpoints) {
        try {
            const res = await axios.get(url, {
                params: { serviceKey: key, pageNo: 1, numOfRows: 1, type: 'json' },
                timeout: 5000
            });
            const msg = `SUCCESS: ${url} (Status: ${res.status})\n`;
            console.log(msg);
            output += msg;
        } catch (err) {
            if (err.response && err.response.status !== 404) {
                const msg = `POTENTIAL MATCH (${err.response.status}): ${url}\n`;
                console.log(msg);
                output += msg;
            }
        }
    }
    fs.writeFileSync('api_results.txt', output);
    console.log('Finished testing.');
}

testEndpoints();
