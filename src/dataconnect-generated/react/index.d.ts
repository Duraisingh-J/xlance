import { CreateProjectData, GetProjectsData, UpdateUserDisplayNameData, UpdateUserDisplayNameVariables, GetUserData } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateProject(options?: useDataConnectMutationOptions<CreateProjectData, FirebaseError, void>): UseDataConnectMutationResult<CreateProjectData, undefined>;
export function useCreateProject(dc: DataConnect, options?: useDataConnectMutationOptions<CreateProjectData, FirebaseError, void>): UseDataConnectMutationResult<CreateProjectData, undefined>;

export function useGetProjects(options?: useDataConnectQueryOptions<GetProjectsData>): UseDataConnectQueryResult<GetProjectsData, undefined>;
export function useGetProjects(dc: DataConnect, options?: useDataConnectQueryOptions<GetProjectsData>): UseDataConnectQueryResult<GetProjectsData, undefined>;

export function useUpdateUserDisplayName(options?: useDataConnectMutationOptions<UpdateUserDisplayNameData, FirebaseError, UpdateUserDisplayNameVariables>): UseDataConnectMutationResult<UpdateUserDisplayNameData, UpdateUserDisplayNameVariables>;
export function useUpdateUserDisplayName(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserDisplayNameData, FirebaseError, UpdateUserDisplayNameVariables>): UseDataConnectMutationResult<UpdateUserDisplayNameData, UpdateUserDisplayNameVariables>;

export function useGetUser(options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
export function useGetUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, undefined>;
