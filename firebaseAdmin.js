const admin = require('firebase-admin');

const serviceAccount = require('./remittancetask-firebase-adminsdk-fbsvc-3fa6705006.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
