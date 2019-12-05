require('dotenv').config();
const Service = require('node-windows').Service;
const svc = new Service({
    name: 'lachamelia_api',
    description: 'La chamelia api port ' + process.env.PORT,
    script: __dirname + '\\build\\app.js'
});

svc.on('uninstall', function () {
    console.log('Uninstall complete.');
    console.log('The service exists: ', svc.exists);
});

svc.on('install', function () {
    try {
        svc.start();
        console.log('state', svc);
        console.log('Listen on port ' + process.env.PORT);
    } catch (e) {
        console.log('error', e);
    }
});

svc.install();
