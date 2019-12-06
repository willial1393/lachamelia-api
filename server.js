require('dotenv').config();
const Service = require('node-windows').Service;
const svc = new Service({
    name: 'lachameliaapi',
    description: 'La chamelia api port ' + process.env.PORT,
    script: __dirname + '\\build\\app.js'
});

svc.on('stop', function () {
    console.log('Stop service');
});

svc.on('uninstall', function () {
    console.log('Uninstall complete', !svc.exists);
    svc.install();
});

svc.on('start', function () {
    console.log('Start service');
    console.log('Listen on port ' + process.env.PORT);
});

svc.on('install', async function () {
    console.log('install complete', svc.exists);
    svc.start();
});

svc.on('error', function () {
    console.log('Error service');
});

console.log('Exist service ->', svc.exists);
if (svc.exists) {
    svc.uninstall();
} else {
    svc.install();
}

