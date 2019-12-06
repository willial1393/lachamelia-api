require('dotenv').config();
const Service = require('node-windows').Service;
const svc = new Service({
    name: 'lachameliaapi',
    description: 'La chamelia api port ' + process.env.PORT,
    script: __dirname + '\\build\\app.js'
});

svc.on('uninstall', function () {
    console.log('Uninstall complete', !svc.exists);
    svc.install();
});

svc.on('install', function () {
    console.log('install complete', svc.exists);
    setTimeout(() => {
        svc.start();
        if (svc.exists) {
            console.log('Listen on port ' + process.env.PORT);
        }
    }, 5000);
});

if (svc.exists) {
    svc.stop();
    svc.uninstall();
} else {
    svc.install();
}
