import {EventEmitter} from "events";

function isAddrDiff(addr1=[], addr2=[]) {
  for(let i = 0; i < 4; i++) {
    if(addr1[i] !== addr2[i]) {
      return true;
    }
  }
  return false;
}

export default class SettingManager extends EventEmitter {
  constructor({
    auto=true, 
    ip=[0, 0, 0, 0], 
    subnet=[255, 255, 255, 0], 
    gateway=[192, 168, 1, 1],
    closeValvesTimeout=0,
    primeTimeout=0,
    pumpTimeout=0,
    primeDelay=0,
    postPumpValveDelay=0,
    pressureMonitorDelay=0,
    preTideDelay=0
  }={}) {
    super();
    this.model = {
      auto,
      ip,
      subnet,
      gateway,
      closeValvesTimeout,
      primeTimeout,
      pumpTimeout,
      primeDelay,
      postPumpValveDelay,
      pressureMonitorDelay,
      preTideDelay
    };
    console.log(this.model);
  }

  get json() {
    return JSON.stringify(this.model, null, 2);
  }

  set(newSettings={}) {
    const lastModel = this.model;
    const model = this.model = Object.assign({}, this.model, newSettings);

    if((!!model.auto) !== (!!lastModel.auto) || 
      isAddrDiff(model.ip, lastModel.ip) || 
      isAddrDiff(model.subnet, lastModel.subnet) || 
      isAddrDiff(model.gateway, lastModel.gateway)) {
      this.emit("network-change", this.model);
    }

    this.emit("change", this.model);
    return this;
  }
}
