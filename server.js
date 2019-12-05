require('dotenv').config();
const Service = require('node-windows').Service;
const svc = new Service({
    name: 'lachamelia-api',
    description: 'La chamelia api port ' + process.env.PORT,
    script: __dirname + '\\build\\app.js'
});

svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.on('install', function () {
    console.log('Listen on port ' + process.env.PORT);
    svc.start();
});

svc.install();
