import cp from "child_process";
import {normalize, join} from "path";
import network from "network";

const local = (path) => normalize(join(__dirname, path));
const readScript = local("/network-scripts/read-interface.awk");
const writeScript = local("/network-scripts/write-interface.awk");

function execFile(filename, args, options) {
  return new Promise((resolve, reject) => {
    cp.execFile(filename, args, options, (error, stdout, stderr) => {
      if(error) reject(error);
      else resolve({stdout, stderr});
    });
  });
}

function read(interfacesPath, interfaceName) {
  return new Promise((resolve, reject) => {
    network.get_interfaces_list((error, data) => {
      console.log(data);
      if(error) reject(error);
      else resolve(data);
    });
  });
}

function write(interfaceName, {auto, ip, subnet, gateway}={}) {

}

export default {read, write};
