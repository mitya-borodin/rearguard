"use strict";
const compress = require('compression');
const express = require('express');
const config = require('./config.js');
const path = require('path');
const history = require('connect-history-api-fallback');
const app = express();
app.use(compress());
config.applyProxies(app);
app.use(history());
app.use(express.static(path.join(__dirname, 'public')));
const port = parseInt(process.env.PORT) || parseInt(config.port) || 80;
app.listen(port, () => console.log(`[STATIC_SERVER] was launched on: http://localhost:${port}`));
//# sourceMappingURL=staticServerOrigin.js.map