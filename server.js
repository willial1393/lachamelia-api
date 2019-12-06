require('dotenv').config();
const Service = require('node-windows').Service;
const svc = new Service({
    name: 'lachameliaapi',
    description: 'La chamelia api port ' + process.env.PORT,
    script: __dirname + '\\build\\app.js'
});

svc.on('install', function () {
    try {
        console.log('The service exists: ', svc.exists);
        console.log('Listen on port ' + process.env.PORT);
        svc.start();
    } catch (e) {
        console.log('error');
    }
});

svc.install();
