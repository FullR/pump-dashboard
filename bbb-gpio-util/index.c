#include <stdio.h>
#include <string.h>
#include <stdbool.h>

#define GPIO_PATH "/sys/class/gpio"
#define EXPORT_PATH GPIO_PATH "/export"
#define UNEXPORT_PATH GPIO_PATH "/unexport"

char* validDirections[] = {"in", "out", "high", "low"};

char pinPathBuffer[100];
char pinValuePathBuffer[100];
char pinDirPathBuffer[100];

// returns true if error
bool quickWriteFile(char* filename, char* data, size_t dataTypeSize, size_t dataLength) {
  FILE* file = fopen(filename, "w");
  size_t writtenLength = fwrite(data, dataTypeSize, dataLength, file);
  fclose(file);
  return dataLength != writtenLength;
}

bool strEq(char* a, char* b) {
  return strcmp(a, b) == 0;
}

bool fileExists(char* filename) {
  FILE* file = fopen(filename, "r");
  if(file != NULL) {
    fclose(file);
    return true;
  } else {
    return false;
  }
}

char* getPinDirPath(char* pin) {
  strcpy(pinDirPathBuffer, GPIO_PATH);
  strcat(pinDirPathBuffer, "/gpio");
  strcat(pinDirPathBuffer, pin);
  strcat(pinDirPathBuffer, "/direction");
  return pinDirPathBuffer;
}

char* getPinValuePath(char* pin) {
  strcpy(pinValuePathBuffer, GPIO_PATH);
  strcat(pinValuePathBuffer, "/gpio");
  strcat(pinValuePathBuffer, pin);
  strcat(pinValuePathBuffer, "/value");
  return pinValuePathBuffer;
}

char* getActiveLowPath(char* pin) {
  strcpy(pinValuePathBuffer, GPIO_PATH);
  strcat(pinValuePathBuffer, "/gpio");
  strcat(pinValuePathBuffer, pin);
  strcat(pinValuePathBuffer, "/active_low");
  return pinValuePathBuffer;
}

bool isValidDirection(char* direction) {
  size_t i;
  size_t length = sizeof(validDirections) / sizeof(char*);
  for(i = 0; i < length; i++) {
    if(strEq(direction, validDirections[i])) {
      return true;
    }
  }
  return false;
}

bool isValidValue(char* value) {
  return strEq(value, "0") || strEq(value, "1");
}

bool isValidActiveLowValue(char* value) {
  return isValidValue(value);
}

void printUsage(char* command) {
  printf("Usage:\n");
  printf("  %s (pinId) (command) [commandArg]\n", command);
  printf("  Commands:\n");
  printf("    export - Export the given pin to make it available for IO\n");
  printf("    unexport - Unexport the given pin to disable it for IO\n");
  printf("    set-direction - Set the direction for a pin (valid values: high, low, up, down)\n");
  printf("    set-value - Set the value for a pin (valid values: 1, 0)\n");
}

bool exportPin(char* pin) {
  printf("Exporting %s\n", pin);
  bool failed = quickWriteFile(EXPORT_PATH, pin, sizeof(char), strlen(pin));
  if(failed) {
    printf("Failed to export\n");
    return true;
  }
  return false;
}

bool unexportPin(char* pin) {
  printf("Unexporting %s\n", pin);
  bool failed = quickWriteFile(UNEXPORT_PATH, pin, sizeof(char), strlen(pin));
  if(failed) {
    printf("Failed to unexport\n");
    return true;
  }
  return false;
}

bool setDirection(char* pin, char* direction) {
  if(!isValidDirection(direction)) {
    printf("Invalid direction: %s\n", direction);
    return true;
  }
  printf("Setting direction of pin %s to %s\n", pin, direction);
  char* directionFileName = getPinDirPath(pin);

  if(fileExists(directionFileName)) {
    bool failed = quickWriteFile(directionFileName, direction, sizeof(char), strlen(direction));
    if(failed) {
      printf("Failed to write direction\n");
      return true;
    }
  } else {
    printf("Direction file not found. Was the pin exported?\n");
    return true;
  }
  return false;
}

bool setValue(char* pin, char* value) {
  if(!isValidValue(value)) {
    printf("Invalid value: %s\n", value);
    return true;
  }
  printf("Setting value of pin %s to %s\n", pin, value);
  char* valueFileName = getPinValuePath(pin);
  if(fileExists(valueFileName)) {
    bool failed = quickWriteFile(valueFileName, value, sizeof(char), strlen(value));
    if(failed) {
      printf("Failed to write value\n");
      return true;
    }
  } else {
    printf("Value file not found. Was the pin exported?\n");
    return true;
  }
  return false;
}

bool setActiveLow(char* pin, char* value) {
  if(!isValidActiveLowValue(value)) {
    printf("Invalid active_low value: %s\n", value);
    return true;
  }
  printf("Setting active_low value of pin %s to %s\n", pin, value);
  char* fileName = getActiveLowPath(pin);
  if(fileExists(fileName)) {
    bool failed = quickWriteFile(fileName, value, sizeof(char), strlen(value));
    if(failed) {
      printf("Failed to write active_low value\n");
      return true;
    }
  } else {
    printf("active_low file not found. Was the pin exported?\n");
    return true;
  }
  return false;
}

int main(size_t argc, char* argv[]) {
  bool errorFlag;

  if(argc <= 2 || strEq("--help", argv[1])) {
    printUsage(argv[0]);
  } else {
    char* pin = argv[1];
    char* command = argv[2];

    if(strEq(command, "export")) {
      errorFlag = exportPin(pin);
    } else if(strEq(command, "unexport")) {
      errorFlag = unexportPin(pin);
    } else if(strEq(command, "set-direction")) {
      if(argc <= 3) {
        printf("set-direction requires direction argument\n");
        errorFlag = true;
      } else {
        char* direction = argv[3];
        errorFlag = setDirection(pin, direction);
      }
    } else if(strEq(command, "set-value")) {
      if(argc <= 3) {
        printf("set-value requires value argument\n");
        errorFlag = true;
      } else {
        char* value = argv[3];
        errorFlag = setValue(pin, value);
      }
    } else if(strEq(command, "set-active-low")) {
      if(argc <= 3) {
        printf("set-active-low requires value argument\n");
        errorFlag = true;
      } else {
        char* value = argv[3];
        errorFlag = setActiveLow(pin, value);
      }
    } else {
      errorFlag = true;
      printf("Unrecognized command: %s\n", command);
      printUsage(argv[0]);
    }
  }

  if(errorFlag) return 1;
  return 0;
}
