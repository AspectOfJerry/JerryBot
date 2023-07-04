const {logger, sleep} = require("../modules/jerryUtils.js");


logger.append("debug", "TEST", "---------- Displaying log message formats ----------");
logger.append("info", "EXEC", "'/command' > Hello, World!");
logger.append("notice", "EXEC", "'/command' > [InsufficientPermissionException] on role compare, '@user1' EQUAL '@user2'");
logger.append("debug", "TEST", "---------- Test concluded ----------");
