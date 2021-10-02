const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const path = require('path');

async function run() {
  try {
    await exec('git', ['config', '--local', 'user.name', 'GitHub Action']);
    await exec('git', ['config', '--local', 'user.email', 'action@github.com']);

    // get input
    const inputBranch = core.getInput('branch');
    const commitMsg = core.getInput('commit_msg');
    const nccArgs = core.getInput('ncc_args');
    const allowUnrelated = core.getInput('allow_unrelated');
    const src = path.resolve(path.join(process.cwd(), core.getInput('src')));


    // //TODO remove
    // await exec('git', ['pull', 'origin', 'master'])

    // if (inputBranch !== 'master') {
    //   await exec('git', ['checkout', inputBranch]);
    // }
 
    // pull latest
    await exec('git', ['pull', 'origin', inputBranch, allowUnrelated ? '--allow-unrelated-histories' : '']);

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
    await exec('git', ['commit', '-a', '-m', commitMsg]);
    await exec('git', ['push', 'origin', `HEAD:${inputBranch}`]);

    core.endGroup('Pushing dist');
    core.info('Compiled and pushed successfully 📦 🎉 ');
  } catch (error) {
    core.setFailed(`ncc failed! ${error.message}`);
  }
}

run();
