const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const fs = require('fs');
const path = require('path');
const util = require('util');
const ncc = require('@zeit/ncc');
const mkdir = util.promisify(fs.mkdir);
const write = util.promisify(fs.writeFile);

async function run() {
  try {
    const { pusher: { email, name } } = github.context.payload;

    const inputBranch = core.getInput('branch');
    const src = path.resolve(path.join(__dirname, core.getInput('src')));

    await exec('git', ['config', '--local', 'user.name', name]);
    await exec('git', ['config', '--local', 'user.email', email]);

    // install dependencies
    await exec('npm', ['install']);

    // compile code
    const everything = await ncc(src);

    const { code } = everything;
    // create dist folder
    await mkdir('dist', { recursive: true });

    // write final code asset
    await write(`dist/index.js`, code);
    
    // push dist
    await exec('git', ['add', '.']);
    await exec('git', ['commit', '-a', '-m', 'dist update']);
    await exec('git', ['push', 'origin', `HEAD:${inputBranch}`]);

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();
