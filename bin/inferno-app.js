#!/usr/bin/env node
const bin = require('../lib/generalBin');

process.env.INFERNOJS_SPA = 'true';

bin('inferno-app', false);
