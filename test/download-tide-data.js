import downloadTideData from "../server/download-tide-data";

describe("downloadTideData", () => {
  it("should download a array of timestamps", (done) => {
    downloadTideData({
      stationId: "9432780",
      startTime: Date.now(),
      endTime: Date.now() + (1000 * 60 * 60 * 24 * 7)
    })
    .then((data) => {
      if(!Array.isArray(data)) {
        done(new Error("Data is not an array"));
      } else if(!data.length) {
        done(new Error("No results in data"));
      } else if(data.some(isInvalidTimestamp)) {
        done(new Error("Data contains invalid timestamps"));
      } else {
        done();
      }
    }, done);

    function isInvalidTimestamp(n) {
      return typeof n !== "number" || n <= 0;
    }
  });
});
