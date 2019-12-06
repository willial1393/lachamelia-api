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

svc.on('start', function () {
    console.log('Start service');
    console.log('Listen on port ' + process.env.PORT);
});

svc.on('install', async function () {
    console.log('install complete', svc.exists);
    await setTimeout(() => {
        svc.start();
    }, 5000);
});

if (svc.exists) {
    svc.stop();
} else {
    svc.install();
}
