var externalSystem = require("./dist/external-system");
var timeouts = require("./settings");

externalSystem({
  timeouts: timeouts,
  log: function(s) { console.log(s); }
}).subscribe(function(){}, function(error) {
  console.error("Error: " + error);
  console.trace();
}, function() {
  console.log("Done");
});
 
