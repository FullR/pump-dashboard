# Linux GPIO Utility
Written for use with Ubuntu on a Beaglebone Black.

## Build
```bash
./build
```

## Usage
```
./pin.exe (pinId) (command) [commandArg]
```

## Commands

### export
Prepares the pin to be used for IO.
```
./pin.exe (pinId) export
```

### unexport
Disabled the pin for IO.
```
./pin.exe (pinId) unexport
```

### set-direction
Sets the direction of the pin. Valid directions are `in`, `out`, `high`, and `low`.
```
./pin.exe (pinId) set-direction (direction)
```

### set-value
Writes a value to the pin. Valid values are `0` and `1`. Note: this will not work properly if the pin's direction is `in`.
```
./pin.exe (pinId) set-value (value)
```
