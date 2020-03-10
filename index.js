const core = require('@actions/core');
const { exec } = require('@actions/exec');
const github = require('@actions/github');
const ncc = require('@zeit/ncc');
const fs = require('fs');
const util = require('util');
const mkdir = util.promisify(fs.mkdir);
const write = util.promisify(fs.writeFile);

async function run() {
  try {
    const { pusher: { email, name } } = github.context.payload;

    const inputBranch = core.getInput('branch');
    const src = core.getInput('src');
    
    await exec('git', ['config', '--local', 'user.name', name]);
    await exec('git', ['config', '--local', 'user.email', email]);

    // install dependencies
    await exec('npm', ['install']);

    // compile code
    ncc(`./${src}`, {
      cache: false
    }).then(async (everything) => {
      const { code, assets } = everything;
      // create dist folder
      await mkdir('dist', {recursive: true});
      
      // create assets
      Object.keys(assets).map(async asset => {
        await write(`dist/${asset}`, assets[asset].source);
      });

      // write final code asset
      const fileName = Object.keys(assets)[0].split('.')[0];
      await write(`dist/${fileName}.js`, code);
    });

    // push dist
    await exec('git', ['push', 'origin', `HEAD:${inputBranch}`])

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();
