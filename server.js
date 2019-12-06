require('dotenv').config();
const Service = require('node-windows').Service;
const svc = new Service({
    name: 'lachameliaapi',
    description: 'La chamelia api port ' + process.env.PORT,
    script: __dirname + '\\build\\app.js'
});

svc.on('install', function () {
    try {
        svc.start();
        console.log('The service exists: ', svc.exists);
        console.log('The service exists: ', svc.getState());
        console.log('Listen on port ' + process.env.PORT);
    } catch (e) {
        console.log('error', e);
    }
});

svc.install();
