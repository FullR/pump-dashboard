import ScheduleManager from "../server/schedule-manager-class";

describe("ScheduleManager", () => {
  it("should emit a change event when modified", (done) => {
    const scheduleManager = new ScheduleManager();
    scheduleManager.once("change", () => done());
    scheduleManager.enableManual();
    setTimeout(() => done(new Error("ScheduleManager did not emit a change event after being modified")), 1000);
  });
});