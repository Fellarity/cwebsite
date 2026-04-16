/* eslint-disable @typescript-eslint/no-require-imports */
const https = require('http');

const endpoints = [
    '/api/users/profile',
    '/api/bookings',
    '/api/payments/create-order'
];

async function testUnauthorizedAccess() {
    console.log("--- 🛡️ Starting Security Audit: Unauthorized Access Test ---");
    for (const path of endpoints) {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: 'GET'
        };

        const req = https.request(options, (res) => {
            console.log(`Endpoint: ${path} | Status: ${res.statusCode} | Result: ${res.statusCode === 401 ? '✅ SECURE' : '❌ VULNERABLE'}`);
        });

        req.on('error', () => {
            // If server isn't running, this is expected
            console.log(`Endpoint: ${path} | Error: Could not connect (Server likely offline)`);
        });

        req.end();
    }
}

testUnauthorizedAccess();
