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

    setTimeout(() => done(new Error("Scheduler didn't emit empty")), 1000);
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
    scheduler.once("interval", () => {
      if(isNearNow(nextTime)) {
        done();
      } else {
        done(new Error("interval emitted at the wrong time: " + (Date.now() - nextTime)));
      }
    }).scheduleNext();

    setTimeout(() => done(new Error("Scheduler took too long")), 500);
  });

  it("should requeue the next closest time after each interval then emit empty once it's complete", () => {
    const now = Date.now();
    const first = now + 100;
    const second = now + 200;
    const third = now + 300;
    const times = [first, second, third];
    const scheduler = new Scheduler(times);
    const fail = () => done("Emitted interval at the wrong time");
    let firstDone = false;
    let secondDone = false;
    let thirdDone = false;

    scheduler.once("interval", () => {
      if(isNearNow(first)) {
        firstDone = true;
        scheduler.once("interval", () => {
          if(isNearNow(second)) {
            secondDone = true;
            scheduler.once("interval", () => {
              thirdDone = true;
              if(!isNearNow()) {
                fail();
              }
            });
          } else {
            fail();
          }
        });
      } else {
        fail();
      }
    });

    scheduler.once("empty", () => {
      if(firstDone && secondDone && thirdDone) {
        done();
      } else {
        done(new Error("Scheduler emitted empty before completing all valid scheduled times"));
      }
    });

    setTimeout(() => done(new Error("Took too long")), (third - now) + 1000);
  });
})