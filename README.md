OIMB Salt water pump controller.

## Commands
* `clean` - Deletes the previous build files
* `build` - Compiles and minifies the front-end code
* `build:dev` - Forces a build in development mode
* `start` - Starts the servers (API server only if `NODE_ENV === production`)
* `start:prod` - Forces the servers to start in production mode

## Configuration
* `defaultAdminPassword` - The initial password for the admin account.
* `manualScheduleMode` - If true, the system will not use tide data to schedule pump jobs; instead, the pump jobs will be run at the times entered by a user using the web interface.
* `noaaStationId` - The station id property to be used when requesting tide data from NOAA.
* `prePumpDelay` - The amount of time before a high tide the pump cycle should begin (does nothing in manual mode)
* `controllerEmail` - The pump controller's email address that it will use to send email alerts (Note: You must define the environmental variable `PUMP_EMAIL_PASSWORD`).
* `emailList`
