# Core-service module
The core-service module is a node.js module to allow easy communication between two Core instances.
For example, It can be used to create a demo user on DemoBox.

### Installation

```sh
# Install
$ npm install core-service --registry https://npm.brighterlink.io
```

### Usage

1. Init module with config:
```
var coreService = require("core-service");

var coreServiceConf = {
	baseUrl: "https://demobox.domain.tld",
	apiKey: "EXAMPLE-AUTH-ABCDEFG123456"
}
coreService.init(coreServiceConf);
```

2. Call `invoke` function to invoke API of another Core instance, e.g. DemoBox:
```
var userData = {
	"email" : "demouser@brightergy.com",
	"role" : "Admin"
};

coreService.createDemoUser(userData, callback);
// callback = function(error, result) { ... };
```
