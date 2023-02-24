const firebase = require('firebase/app');
require("dotenv").config();
const firebaseConfig = {
    apiKey,
    authDomain,
    projectId,
    storageBucket,
    messagingSenderId,
    appId,
} = process.env;

module.exports = firebase.initializeApp(firebaseConfig);
