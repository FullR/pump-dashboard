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

  it("should requeue the next closest time after each interval then emit empty once it's complete", (done) => {
    const now = Date.now();
    const first = now + 100;
    const second = now + 200;
    const third = now + 300;
    const times = [first, second, third];
    const scheduler = new Scheduler(times);
    const fail = () => done("Emitted interval at the wrong time");
    const fired = [];

    scheduler.on("interval", (time) => {
      fired.push(time);
    });

    scheduler.once("empty", () => {
      if(times.length !== fired.length) {
        done(new Error("Scheduler emitted an incorrect number of interval events"));
      } else if(times.some((v, i) => v !== fired[i])) {
        done(new Error("Scheduler emitted interval events in an incorrect order: " + fired + " " + times));
      } else {
        done();
      }
    });

    scheduler.scheduleNext();

    setTimeout(() => done(new Error("Took too long")), (third - now) + 5000);
  });
})