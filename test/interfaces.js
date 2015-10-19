import intf from "../server/interfaces";
const testInterfaces = `${__dirname}/../test-interfaces`;

describe("interfaces", () => {
  it("should be able to read a static interfaces ip, subnet, and gateway", (done) => {
    intf.read(testInterfaces, "eth0").then(() => done(), done);
  });
});