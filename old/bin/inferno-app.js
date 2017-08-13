#!/usr/bin/env node
const bin = require('../../lib/generalBin');

process.env.REARGUARD_INFERNO_JS = 'true';

bin('inferno-app', false);
