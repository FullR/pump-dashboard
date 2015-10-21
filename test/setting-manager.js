import SettingManager from "../server/setting-manager-class";

describe("SettingManager", () => {
  it("should emit a change event when modified", (done) => {
    const settingManager = new SettingManager();

    settingManager.once("change", () => done());
    settingManager.set({
      address: [1,1,1,1]
    });
    setTimeout(() => done(new Error("SettingManager did not emit a change event when modified")), 1000);
  });

  it("should emit a network-change event when any network setting changes", (done) => {
    const settingManager = new SettingManager({address: [2, 3, 4, 5]});

    settingManager.once("network-change", () => done());
    settingManager.set({
      address: [1,1,1,1]
    });
    setTimeout(() => done(new Error("SettingManager did not emit a change event when modified")), 1000);
  });

  it("should not emit a network-change event when replacing a network value with an identical value", (done) => {
    const settingManager = new SettingManager({address: [1, 1, 1, 1]});

    settingManager.once("network-change", () => done(new Error("emitted a network-change event despite the new value being identical to the old value")));
    settingManager.set({
      address: [1,1,1,1]
    });
    setTimeout(() => done(), 300);
  });
});