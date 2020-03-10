const core = require('@actions/core');
const { exec } = require('@actions/exec');

async function run() {
  try {
    const code = core.getInput('dir');

    require('@zeit/ncc')(code, {
      cache: false,
      externals: ["externalpackage"],
      sourceMapBasePrefix: '../', 
    }).then(({ code, map, assets }) => {
      core.info(code);
      console.log(map);
      console.log(assets);
    });

  } catch (error) {
    core.setFailed(`Failed to publish ${error.message}`);
  }
}

run();
