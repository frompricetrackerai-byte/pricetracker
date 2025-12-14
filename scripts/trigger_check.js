const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/monitor/check-prices',
    method: 'GET',
};

console.log('triggering price check...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    console.log('If the server is not running, please start it or wait for the next cron job.');
});

req.end();
