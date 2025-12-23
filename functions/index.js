const { onUserCreate } = require('./auth/onUserCreate');
const { createJob } = require('./jobs/createJob');
const { submitProposal } = require('./proposals/submitProposal'); // create file similar to createJob
const { onMessageWrite } = require('./messages/onMessageWrite');
const { createEscrow } = require('./payments/createEscrow');

exports.onUserCreate = onUserCreate;
exports.createJob = createJob;
exports.submitProposal = submitProposal;
exports.onMessageWrite = onMessageWrite;
exports.createEscrow = createEscrow;
