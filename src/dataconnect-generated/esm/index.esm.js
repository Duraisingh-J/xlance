import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'project',
  location: 'us-east4'
};

export const createProjectRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateProject');
}
createProjectRef.operationName = 'CreateProject';

export function createProject(dc) {
  return executeMutation(createProjectRef(dc));
}

export const getProjectsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetProjects');
}
getProjectsRef.operationName = 'GetProjects';

export function getProjects(dc) {
  return executeQuery(getProjectsRef(dc));
}

export const updateUserDisplayNameRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserDisplayName', inputVars);
}
updateUserDisplayNameRef.operationName = 'UpdateUserDisplayName';

export function updateUserDisplayName(dcOrVars, vars) {
  return executeMutation(updateUserDisplayNameRef(dcOrVars, vars));
}

export const getUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser');
}
getUserRef.operationName = 'GetUser';

export function getUser(dc) {
  return executeQuery(getUserRef(dc));
}

