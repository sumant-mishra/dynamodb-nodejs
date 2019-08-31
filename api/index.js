const express = require('express')
const router = express.Router()

require('./routes/proposals')(router);
require('./routes/applications')(router);
//require('./routes/students')(router);
require('./routes/companies')(router);

module.exports = router;