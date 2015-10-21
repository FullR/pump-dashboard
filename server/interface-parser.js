const s = "\\s+"
const ipMatch = "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}";
const parseIp = (s) => s.split(".").map((c) => parseInt(c));

function getDeviceRegExp(device) {
  const deviceMatch = `[^#]iface${s}${device}${s}inet${s}(static|dhcp|manual)`;
  const staticMatch = `address${s}(${ipMatch})${s}netmask${s}(${ipMatch})${s}gateway${s}(${ipMatch})`;
  const manualMatch = `(up|down)${s}(.*)${s}(up|down)${s}(.*)`;

  return new RegExp(`${deviceMatch}${s}(?:(?:${staticMatch})|(?:${manualMatch}))?`);
}

function parseInterface(ifaceData, device) {
  const deviceRegExp = getDeviceRegExp(device);
  const match = ifaceData.match(deviceRegExp);
  let type;

  if(!match) {
    throw new Error("device not found or malformed interfaces string");
  } else {
    type = match[1];
  }

  switch(type) {
    case "manual": return {
      type, 
      up: match[6], 
      down: match[8]
    };
    case "static": return {
      type, 
      address: parseIp(match[2]),
      netmask: parseIp(match[3]),
      gateway: parseIp(match[4])
    }
    default: return {type};
  }
}

function replaceInterface(ifaceData, device, {type="dhcp", address, netmask, gateway, up, down}) {
  const deviceRegExp = getDeviceRegExp(device);
  if(type === "dhcp") {
    return ifaceData.replace(deviceRegExp, () => `\n\niface ${device} inet dhcp\n`);
  } else if(type === "static") {
    return ifaceData.replace(deviceRegExp, () => `\n\niface ${device} inet static\n  address ${address.join(".")}\n  netmask ${netmask.join(".")}\n  gateway ${gateway.join(".")}\n`);
  } else if(type === "manual") {
    return ifaceData.replace(deviceRegExp, () => `\n\niface ${device} inet manual\n  up ${up}\n  down ${down}\n`);
  } else {
    throw new Error(`Unrecoginzed interface type: ${type}`);
  }
}

export default {parseInterface, replaceInterface};
