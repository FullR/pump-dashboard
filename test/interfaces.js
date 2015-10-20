import {parseInterface, replaceInterface} from "../server/interfaces";

const testData = `
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).
 
# The loopback network interface
auto lo
iface lo inet loopback
 
# The primary network interface
auto eth0 eth1 eth2 eth3
 
iface eth3 inet static
    address 10.0.11.100
    netmask 255.255.255.0
    gateway 10.0.11.1
 
iface eth1 inet manual
    up ifconfig $IFACE 0.0.0.0 up
    down ifconfig $IFACE down
 
iface eth2 inet static
    address 192.168.1.2
    netmask 255.255.255.0
    gateway 192.168.1.254

iface eth0 inet dhcp
`;

const arrayEqual = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

describe("interfaces", () => {
  it("should be able to read a static interface's ip, subnet, and gateway", () => {
    const device = "eth3";
    const address = [10, 0, 11, 100];
    const netmask = [255, 255, 255, 0];
    const gateway = [10, 0, 11, 1];
    const result = parseInterface(testData, device);

    if(!arrayEqual(result.address, address)) {
      throw new Error("address does not match expected");
    } else if(!arrayEqual(result.netmask, netmask)) {
      throw new Error("netmask does not match expected");
    } else if(!arrayEqual(result.gateway, gateway)) {
      throw new Error("gateway does not match expected");
    }
  });

  it("should be able to read a manual interface's up and down scripts", () => {
    const device = "eth1";
    const result = parseInterface(testData, device);
    const expectedUp = "ifconfig $IFACE 0.0.0.0 up";
    const expectedDown = "ifconfig $IFACE down";

    if(expectedUp !== result.up) {
      throw new Error("up script did not match expected");
    }
    if(expectedDown !== result.down) {
      throw new Error("down script did not match expected");
    }
  });

  it("should be able to read the type of a static interface", () => {
    const device = "eth3";
    if(parseInterface(testData, device).type !== "static") {
      throw new Error("type does not match expected");
    }
  });

  it("should be able to read the type of a dhcp interface", () => {
    const device = "eth0";
    if(parseInterface(testData, device).type !== "dhcp") {
      throw new Error("type does not match expected");
    }
  });

  it("should be able to read the type of a manual interface", () => {
    const device = "eth1";
    if(parseInterface(testData, device).type !== "manual") {
      throw new Error("type does not match expected");
    }
  });
});