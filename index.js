const core = require('@actions/core');
const { exec } = require('@actions/exec');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const write = util.promisify(fs.writeFile);

async function run() {
  try {
    const codeDirectory = core.getInput('dir');

    require('@zeit/ncc')('./index.js', {
      cache: false,
      sourceMapBasePrefix: '../', 
    }).then(async ({ code, map, assets }) => {
      core.info(code);
      await mkdir('dist');
      await write(`dist/index.js`, code);
    });

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();
