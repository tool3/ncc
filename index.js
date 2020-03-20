const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const path = require('path');

async function run() {
  try {
    const { pusher: { email, name } } = github.context.payload;

    // git auth
    await exec('git', ['config', '--local', 'user.name', name]);
    await exec('git', ['config', '--local', 'user.email', email]);

    // get input
    const inputBranch = core.getInput('branch');
    const commitMsg = core.getInput('commit_msg');
    const nccArgs = core.getInput('ncc_args');
    const src = path.resolve(path.join(process.cwd(), core.getInput('src')));

    // pull latest
    await exec('git', ['pull', 'origin', `HEAD:${inputBranch}`]);

    core.startGroup(`Compiling ${src}`);

    // install dependencies
    await exec('npm', ['install']);

    // compile code
    const compileArgs = ['@zeit/ncc', 'build', src];

    if (nccArgs) {
      const args = nccArgs.split(',');
      compileArgs.push(...args);
    }

    await exec('npx', compileArgs);
    
    core.endGroup(`Compiling ${src}`);

    core.startGroup('Pushing dist');

    // push dist
    await exec('git', ['add', 'dist/index.js']);
    await exec('git', ['commit', '-a', '-m',  commitMsg]);
    await exec('git', ['push', 'origin', `HEAD:${inputBranch}`]);

    core.endGroup('Pushing dist');
    core.info('Compiled and pushed successfully 📦 🎉 ');

  } catch (error) {
    core.setFailed(`ncc failed! ${error.message}`);
  }
}

run();
