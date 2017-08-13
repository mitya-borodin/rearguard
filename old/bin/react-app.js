#!/usr/bin/env node
const bin = require('../../lib/generalBin');

process.env.REARGUARD_REACT = 'true';

bin('react-app', true);
