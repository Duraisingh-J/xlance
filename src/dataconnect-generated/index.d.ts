import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateProjectData {
  project_insert: Project_Key;
}

export interface DatabaseConnection_Key {
  id: UUIDString;
  __typename?: 'DatabaseConnection_Key';
}

export interface Deployment_Key {
  id: UUIDString;
  __typename?: 'Deployment_Key';
}

export interface GetProjectsData {
  projects: ({
    id: UUIDString;
    name: string;
    description?: string | null;
  } & Project_Key)[];
}

export interface GetUserData {
  user?: {
    id: UUIDString;
    displayName: string;
    email: string;
  } & User_Key;
}

export interface Project_Key {
  id: UUIDString;
  __typename?: 'Project_Key';
}

export interface Schema_Key {
  id: UUIDString;
  __typename?: 'Schema_Key';
}

export interface UpdateUserDisplayNameData {
  user_update?: User_Key | null;
}

export interface UpdateUserDisplayNameVariables {
  displayName: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateProjectRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateProjectData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateProjectData, undefined>;
  operationName: string;
}
export const createProjectRef: CreateProjectRef;

export function createProject(): MutationPromise<CreateProjectData, undefined>;
export function createProject(dc: DataConnect): MutationPromise<CreateProjectData, undefined>;

interface GetProjectsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetProjectsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetProjectsData, undefined>;
  operationName: string;
}
export const getProjectsRef: GetProjectsRef;

export function getProjects(): QueryPromise<GetProjectsData, undefined>;
export function getProjects(dc: DataConnect): QueryPromise<GetProjectsData, undefined>;

interface UpdateUserDisplayNameRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserDisplayNameVariables): MutationRef<UpdateUserDisplayNameData, UpdateUserDisplayNameVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserDisplayNameVariables): MutationRef<UpdateUserDisplayNameData, UpdateUserDisplayNameVariables>;
  operationName: string;
}
export const updateUserDisplayNameRef: UpdateUserDisplayNameRef;

export function updateUserDisplayName(vars: UpdateUserDisplayNameVariables): MutationPromise<UpdateUserDisplayNameData, UpdateUserDisplayNameVariables>;
export function updateUserDisplayName(dc: DataConnect, vars: UpdateUserDisplayNameVariables): MutationPromise<UpdateUserDisplayNameData, UpdateUserDisplayNameVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetUserData, undefined>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(): QueryPromise<GetUserData, undefined>;
export function getUser(dc: DataConnect): QueryPromise<GetUserData, undefined>;

