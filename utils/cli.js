#! /usr/bin/env node
const { execSync } = require('child_process');
const { renameSync, rmSync } = require('fs');
try {
    console.log('\nInstalling Dependencies...\n');
    execSync('git clone --depth 1 https://github.com/GmrG0dd/Hydrated-React-Local-Full-Stack.git');
    var name = 'New App';
    if(process.argv[2])  name = process.argv[2];
    renameSync('./Hydrated-React-Local-Full-Stack', `./${name}`);
    execSync(`cd ${name} && npm install`);
    console.log('\nReady!\n');
    rmSync(`./${name}/utils/cli.js`);
} catch (err){
    console.log(err.toString());
}