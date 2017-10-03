const compress = require('compression');
const express = require('express');
const config = require('./config.js');
const path = require('path');
const history = require('connect-history-api-fallback');
const app = express();

app.use(compress());

//
// Register Node.js HTTP and web socket proxy middleware.
// -----------------------------------------------------------------------------
config.applyProxies(app);
app.use(history());
//
// Register Node.js resolve static files middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

const port = parseInt(process.env.PORT) || parseInt(config.port) || 80;

app.listen(port, () => console.log(`[STATIC_SERVER] was launched on: http://localhost:${port}`));

