#!/usr/bin/env node

const jwt = require('jsonwebtoken');
const fs = require('fs');
const yargs = require('yargs');
const dotenv = require('dotenv');

dotenv.config();

// Use yargs to handle command-line arguments more easily
const argv = yargs
  .usage('Usage: $0 --pem [path to pem file] --appid [application id]')
  .option('pem', {
    alias: 'p',
    describe: 'Path to private PEM file',
    demandOption: 'The pem file is required',
    type: 'string'
  })
  .option('appid', {
    alias: 'a',
    describe: 'GitHub application ID',
    demandOption: 'The app ID is required',
    type: 'string',
    default: process.env.GITHUB_APP_ID
  })
  .help()
  .argv;

// Read PEM file from path provided in command line arguments
const pemFilePath = argv.pem;
// Read GitHub application ID from the command line arguments
const appId = argv.appid;

// Read the PEM file synchronously
const privateKey = fs.readFileSync(pemFilePath);

// Define JWT payload
const payload = {
  // Issued at time
  iat: Math.floor(Date.now() / 1000),
  // JWT expiration time (10 minutes maximum)
  exp: Math.floor(Date.now() / 1000) + 600,
  // GitHub App's identifier
  iss: appId
};

// Sign and create the JWT
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

console.log(`JWT:  ${token}`);
