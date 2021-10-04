const core = require('@actions/core');
const { exec } = require('@actions/exec');
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
 
    // pull latest
    await exec('git', ['pull', 'origin', inputBranch, allowUnrelated ? '--allow-unrelated-histories' : '']);

    core.startGroup(`Compiling ${src}`);

    // install dependencies
    await exec('npm', ['install']);

    // compile code
    const compileArgs = ['@vercel/ncc', 'build', src];

    if (nccArgs) {
      const args = nccArgs.split(',').map(c => c.trim());
      compileArgs.push(...args);
    }

    await exec('npx', compileArgs);

    core.endGroup(`Compiling ${src}`);

    core.startGroup('Pushing dist');

    // push dist
    try {
      await exec('git', ['add', 'dist/index.js']);
      await exec('git', ['commit', '-a', '-m', commitMsg]);
    } catch (error) {
      if (error.stdout.includes('nothing to commit, working tree clean')) {
        return core.info('Nothing to commit! 🙂');
      }
      throw error;
    }
    

    core.endGroup('Pushing dist');
    await exec('git', ['push', 'origin', `HEAD:${inputBranch}`]);  
    core.info('Compiled and pushed successfully 📦 🎉 ');

  } catch (error) {
    core.setFailed(`ncc failed! ${error.message}`);
  }
}

run();
