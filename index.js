const core = require('@actions/core');
const { exec } = require('@actions/exec');
const path = require('path');

async function run() {
  try {
    // get input
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

    core.info('Compiled successfully 📦 🎉 ');
  } catch (error) {
    core.setFailed(`ncc failed! ${error.message}`);
  }
}

run();
