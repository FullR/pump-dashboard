import Scheduler from "../server/scheduler";

function isNearNow(t, range=100) {
  return Math.abs(Date.now() - t) < range;
}

describe("scheduler", () => {
  it("should emit 'empty' if it is started with no times after the current time", (done) => {
    const now = Date.now();
    const times = [
      now - 100,
      now - 300,
      now - 1000
    ];
    const scheduler = new Scheduler(times);

    scheduler.once("empty", () => done());

    scheduler.scheduleNext();

    setTimeout(() => done(new Error("Scheduler didn't emit empty")), 5000);
  });

  it("should wait for the closest time in its times and emit 'interval'", (done) => {
    const now = Date.now();
    const nextTime = now + 250;
    const times = [
      now - 500,
      now + 500,
      now + 1000,
      nextTime,
      now + 3000
    ];
    const scheduler = new Scheduler(times);
    scheduler
    .once("interval", () => {
      if(isNearNow(nextTime)) {
        done();
      } else {
        done(new Error("interval emitted at the wrong time: " + (Date.now() - nextTime)));
      }
    })
    .once("empty", () => {
      done(new Error("Scheduler emitted empty"));
    })
    .scheduleNext();

    setTimeout(() => done(new Error("Scheduler took too long")), 5000);
  });
});
