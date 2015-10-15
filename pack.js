const pkg = require("./package");
const dependencies = pkg.dependencies;
const _exec = require("child_process").exec;

function exec(command, options) {
  return new Promise(function(resolve, reject) {
    _exec(command, options, function(error, stdout, stderr) {
      if(error) reject(error);
      else resolve({stdout: stdout, stderr: stderr});
    });
  });
}

function cmd(command, options) {
  return function() {
    return exec(command, options);
  };
}

Promise.resolve()
  .then(cmd("rm -rf Production-Build"))
  .then(cmd("npm run build"))
  .then(cmd("cp -R dist Production-Build"))
  .then(cmd("mkdir -p Production-Build/node_modules"))
  .then(cmd("cp package.json Production-Build"))
  .then(function() {
    return Object.keys(dependencies).reduce(function(p, dependency) {
      return p.then(cmd("cp -R node_modules/" + dependency + " Production-Build/node_modules"));
    }, Promise.resolve());
  })
  .catch(function(error) {
    console.log(error);
  });
