const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const path = require('path');

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
    await exec('npx', ['@zeit/ncc', 'build', src]);
    
    // push dist
    await exec('git', ['add', 'dist/index.js']);
    await exec('git', ['commit', '-a', '-m', 'dist update']);
    await exec('git', ['push', 'origin', `HEAD:${inputBranch}`]);

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();
