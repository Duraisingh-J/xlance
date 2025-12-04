const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'project',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createProjectRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProject');
}
createProjectRef.operationName = 'CreateProject';
exports.createProjectRef = createProjectRef;

exports.createProject = function createProject(dc) {
  return executeMutation(createProjectRef(dc));
};

const getProjectsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProjects');
}
getProjectsRef.operationName = 'GetProjects';
exports.getProjectsRef = getProjectsRef;

exports.getProjects = function getProjects(dc) {
  return executeQuery(getProjectsRef(dc));
};

const updateUserDisplayNameRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserDisplayName', inputVars);
}
updateUserDisplayNameRef.operationName = 'UpdateUserDisplayName';
exports.updateUserDisplayNameRef = updateUserDisplayNameRef;

exports.updateUserDisplayName = function updateUserDisplayName(dcOrVars, vars) {
  return executeMutation(updateUserDisplayNameRef(dcOrVars, vars));
};

const getUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser');
}
getUserRef.operationName = 'GetUser';
exports.getUserRef = getUserRef;

exports.getUser = function getUser(dc) {
  return executeQuery(getUserRef(dc));
};
