/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

/** Model of the image */
export enum AiModelOptionsEnum {
  Model_1 = 'MODEL_1',
  Model_2 = 'MODEL_2'
}

export type AddFeedbackInput = {
  feedback: Scalars['String']['input'];
};

/** Aspect ratio of the image */
export enum AspectRatioOptionsEnum {
  Landscape = 'LANDSCAPE',
  Portrait = 'PORTRAIT',
  Square = 'SQUARE'
}

/** Camera type of the image */
export enum CameraOptionsEnum {
  NoSelfie = 'NO_SELFIE',
  Selfie = 'SELFIE'
}

export type ConfirmUserEmailInput = {
  hash: Scalars['String']['input'];
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

/** Status of the image */
export enum GenAiStatusEnum {
  Failed = 'FAILED',
  Generated = 'GENERATED',
  NonGenerated = 'NON_GENERATED',
  Pending = 'PENDING'
}

/** Gender of the image */
export enum GenderOptionsEnum {
  Female = 'FEMALE',
  Male = 'MALE'
}

export type Image = Node & {
  __typename?: 'Image';
  aspectRatio: AspectRatioOptionsEnum;
  camera?: Maybe<CameraOptionsEnum>;
  /** Globally unique identifier representing a concrete GraphQL ObjectType */
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  isExample: Scalars['Boolean']['output'];
  model?: Maybe<AiModelOptionsEnum>;
  originalImages: Array<Image>;
  prompt?: Maybe<Scalars['String']['output']>;
  status: GenAiStatusEnum;
  thumbnailUrl?: Maybe<Scalars['String']['output']>;
};

export type ImageConnection = {
  __typename?: 'ImageConnection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Array<ImageEdge>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

export type ImageCreationInput = {
  age?: InputMaybe<Scalars['Int']['input']>;
  aspectRatio?: InputMaybe<AspectRatioOptionsEnum>;
  camera?: InputMaybe<CameraOptionsEnum>;
  gender?: InputMaybe<GenderOptionsEnum>;
  imageCreationType?: InputMaybe<ImageCreationTypeEnum>;
  model?: InputMaybe<AiModelOptionsEnum>;
  prompt: Scalars['String']['input'];
};

/** Type of the image */
export enum ImageCreationTypeEnum {
  AiModel = 'AI_MODEL',
  OtherImage = 'OTHER_IMAGE'
}

export type ImageEdge = {
  __typename?: 'ImageEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String']['output'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Image;
};

export type ImageEditInput = {
  imageIds?: InputMaybe<Array<Scalars['String']['input']>>;
  prompt: Scalars['String']['input'];
};

/** Type of the image */
export enum ImageTypeOptionsEnum {
  Created = 'CREATED',
  Edited = 'EDITED',
  UserUploaded = 'USER_UPLOADED',
  VirtualTryOn = 'VIRTUAL_TRY_ON'
}

export type Me = Node & UserLike & {
  __typename?: 'Me';
  customerPortalUrl: Scalars['String']['output'];
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  hasActiveSubscription: Scalars['Boolean']['output'];
  /** Globally unique identifier representing a concrete GraphQL ObjectType */
  id: Scalars['ID']['output'];
  isSocialLogin: Scalars['Boolean']['output'];
  onboarding: Onboarding;
  planFeaturesUsage?: Maybe<PlanFeaturesUsage>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addFeedback: Scalars['Boolean']['output'];
  confirmUserEmail?: Maybe<Me>;
  forgotPassword: Scalars['Boolean']['output'];
  imageCreation: Image;
  imageEdit: Image;
  resetPassword: Scalars['Boolean']['output'];
  signIn: Me;
  signOut: Scalars['Boolean']['output'];
  signUp: Scalars['Boolean']['output'];
  updateUserPassword: Me;
  videoCreation: Video;
  virtualTryOn: Image;
};


export type MutationAddFeedbackArgs = {
  input: AddFeedbackInput;
};


export type MutationConfirmUserEmailArgs = {
  input: ConfirmUserEmailInput;
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationImageCreationArgs = {
  input: ImageCreationInput;
};


export type MutationImageEditArgs = {
  input: ImageEditInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationSignInArgs = {
  input: SignInUserInput;
};


export type MutationSignUpArgs = {
  input: SignUpUserInput;
};


export type MutationUpdateUserPasswordArgs = {
  input: UpdateUserPasswordInput;
};


export type MutationVideoCreationArgs = {
  input: VideoCreationInput;
};


export type MutationVirtualTryOnArgs = {
  input: VirtualTryOnInput;
};

/** Implements the Relay Node spec */
export type Node = {
  /** Globally unique identifier representing a concrete GraphQL ObjectType */
  id: Scalars['ID']['output'];
};

export type Onboarding = {
  __typename?: 'Onboarding';
  hasCreatedFirstImage: Scalars['Boolean']['output'];
  hasCreatedFirstImageEdit: Scalars['Boolean']['output'];
  hasCreatedFirstVideo: Scalars['Boolean']['output'];
};

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars['Boolean']['output'];
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PlanFeaturesUsage = {
  __typename?: 'PlanFeaturesUsage';
  editImage: UsageLimit;
  endDate: Scalars['Date']['output'];
  highResolution: Scalars['Boolean']['output'];
  imageCreation: UsageLimit;
  planId: Scalars['ID']['output'];
  startDate: Scalars['Date']['output'];
  videoCreation: UsageLimit;
};

export type Query = {
  __typename?: 'Query';
  images: ImageConnection;
  me?: Maybe<Me>;
  node?: Maybe<Node>;
  videos: VideoConnection;
};


export type QueryImagesArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  type: Array<ImageTypeOptionsEnum>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryVideosArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};

export type ResetPasswordInput = {
  hash: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignInUserInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SignUpUserInput = {
  email: Scalars['String']['input'];
  fullName: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type UpdateUserPasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type UsageLimit = {
  __typename?: 'UsageLimit';
  limit: Scalars['Int']['output'];
  used: Scalars['Int']['output'];
};

export type UserLike = {
  fullName: Scalars['String']['output'];
  /** Globally unique identifier representing a concrete GraphQL ObjectType */
  id: Scalars['ID']['output'];
};

export type Video = Node & {
  __typename?: 'Video';
  /** Globally unique identifier representing a concrete GraphQL ObjectType */
  id: Scalars['ID']['output'];
  isExample: Scalars['Boolean']['output'];
  negativePrompt?: Maybe<Scalars['String']['output']>;
  originalImages: Array<Image>;
  prompt: Scalars['String']['output'];
  status: GenAiStatusEnum;
  videoUrl?: Maybe<Scalars['String']['output']>;
};

export type VideoConnection = {
  __typename?: 'VideoConnection';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges: Array<VideoEdge>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

export type VideoCreationInput = {
  imagesIds: Array<Scalars['String']['input']>;
  negativePrompt?: InputMaybe<Scalars['String']['input']>;
  prompt: Scalars['String']['input'];
};

export type VideoEdge = {
  __typename?: 'VideoEdge';
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars['String']['output'];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node: Video;
};

export type VirtualTryOnInput = {
  modelImageId: Scalars['String']['input'];
  productImageId: Scalars['String']['input'];
};

export type ImageByIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type ImageByIdQuery = { __typename?: 'Query', node?: { __typename: 'Image', id: string, prompt?: string | null, thumbnailUrl?: string | null, imageUrl?: string | null, originalImages: Array<{ __typename?: 'Image', id: string }> } | { __typename: 'Me' } | { __typename: 'Video' } | null };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id: string, fullName: string, email: string, isSocialLogin: boolean, hasActiveSubscription: boolean } | null };

export type UsageQueryVariables = Exact<{ [key: string]: never; }>;


export type UsageQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id: string, email: string, planFeaturesUsage?: { __typename?: 'PlanFeaturesUsage', planId: string, startDate: any, endDate: any, imageCreation: { __typename?: 'UsageLimit', limit: number, used: number }, editImage: { __typename?: 'UsageLimit', limit: number, used: number }, videoCreation: { __typename?: 'UsageLimit', limit: number, used: number } } | null } | null };

export type ConfirmUserEmailMutationVariables = Exact<{
  input: ConfirmUserEmailInput;
}>;


export type ConfirmUserEmailMutation = { __typename?: 'Mutation', confirmUserEmail?: { __typename?: 'Me', id: string } | null };

export type OnboardingQueryVariables = Exact<{ [key: string]: never; }>;


export type OnboardingQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id: string, onboarding: { __typename?: 'Onboarding', hasCreatedFirstImage: boolean, hasCreatedFirstVideo: boolean, hasCreatedFirstImageEdit: boolean } } | null };

export type AddFeedbackMutationVariables = Exact<{
  input: AddFeedbackInput;
}>;


export type AddFeedbackMutation = { __typename?: 'Mutation', addFeedback: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  input: ForgotPasswordInput;
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type ImageGalleryQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  type: Array<ImageTypeOptionsEnum> | ImageTypeOptionsEnum;
}>;


export type ImageGalleryQuery = { __typename?: 'Query', images: { __typename?: 'ImageConnection', edges: Array<{ __typename?: 'ImageEdge', node: { __typename?: 'Image', id: string, camera?: CameraOptionsEnum | null, aspectRatio: AspectRatioOptionsEnum, prompt?: string | null, status: GenAiStatusEnum, imageUrl?: string | null, thumbnailUrl?: string | null, model?: AiModelOptionsEnum | null, isExample: boolean, originalImages: Array<{ __typename?: 'Image', id: string, imageUrl?: string | null }> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type VideoGalleryQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
}>;


export type VideoGalleryQuery = { __typename?: 'Query', videos: { __typename?: 'VideoConnection', edges: Array<{ __typename?: 'VideoEdge', node: { __typename?: 'Video', id: string, prompt: string, negativePrompt?: string | null, status: GenAiStatusEnum, videoUrl?: string | null, isExample: boolean, originalImages: Array<{ __typename?: 'Image', id: string, thumbnailUrl?: string | null }> } }>, pageInfo: { __typename?: 'PageInfo', endCursor?: string | null, hasNextPage: boolean } } };

export type ImageCreationMutationVariables = Exact<{
  input: ImageCreationInput;
}>;


export type ImageCreationMutation = { __typename?: 'Mutation', imageCreation: { __typename?: 'Image', id: string, prompt?: string | null, status: GenAiStatusEnum, imageUrl?: string | null } };

export type ImageEditMutationVariables = Exact<{
  input: ImageEditInput;
}>;


export type ImageEditMutation = { __typename?: 'Mutation', imageEdit: { __typename?: 'Image', id: string, prompt?: string | null, status: GenAiStatusEnum, imageUrl?: string | null } };

export type SignOutMutationVariables = Exact<{ [key: string]: never; }>;


export type SignOutMutation = { __typename?: 'Mutation', signOut: boolean };

export type ManageSubscriptionQueryVariables = Exact<{ [key: string]: never; }>;


export type ManageSubscriptionQuery = { __typename?: 'Query', me?: { __typename?: 'Me', id: string, customerPortalUrl: string } | null };

export type SignInMutationVariables = Exact<{
  input: SignInUserInput;
}>;


export type SignInMutation = { __typename?: 'Mutation', signIn: { __typename?: 'Me', id: string, email: string, fullName: string } };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { __typename?: 'Mutation', resetPassword: boolean };

export type UpdateUserPasswordMutationVariables = Exact<{
  input: UpdateUserPasswordInput;
}>;


export type UpdateUserPasswordMutation = { __typename?: 'Mutation', updateUserPassword: { __typename?: 'Me', id: string, email: string } };

export type SignUpMutationVariables = Exact<{
  input: SignUpUserInput;
}>;


export type SignUpMutation = { __typename?: 'Mutation', signUp: boolean };

export type VideoCreationMutationVariables = Exact<{
  input: VideoCreationInput;
}>;


export type VideoCreationMutation = { __typename?: 'Mutation', videoCreation: { __typename?: 'Video', id: string, status: GenAiStatusEnum } };

export type VirtualTryOnMutationVariables = Exact<{
  input: VirtualTryOnInput;
}>;


export type VirtualTryOnMutation = { __typename?: 'Mutation', virtualTryOn: { __typename?: 'Image', id: string, status: GenAiStatusEnum, imageUrl?: string | null } };


export const ImageByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ImageById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"InlineFragment","typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Image"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"originalImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<ImageByIdQuery, ImageByIdQueryVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"isSocialLogin"}},{"kind":"Field","name":{"kind":"Name","value":"hasActiveSubscription"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const UsageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Usage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"planFeaturesUsage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"planId"}},{"kind":"Field","name":{"kind":"Name","value":"startDate"}},{"kind":"Field","name":{"kind":"Name","value":"endDate"}},{"kind":"Field","name":{"kind":"Name","value":"imageCreation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"used"}}]}},{"kind":"Field","name":{"kind":"Name","value":"editImage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"used"}}]}},{"kind":"Field","name":{"kind":"Name","value":"videoCreation"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"limit"}},{"kind":"Field","name":{"kind":"Name","value":"used"}}]}}]}}]}}]}}]} as unknown as DocumentNode<UsageQuery, UsageQueryVariables>;
export const ConfirmUserEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfirmUserEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ConfirmUserEmailInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"confirmUserEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<ConfirmUserEmailMutation, ConfirmUserEmailMutationVariables>;
export const OnboardingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Onboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"onboarding"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"hasCreatedFirstImage"}},{"kind":"Field","name":{"kind":"Name","value":"hasCreatedFirstVideo"}},{"kind":"Field","name":{"kind":"Name","value":"hasCreatedFirstImageEdit"}}]}}]}}]}}]} as unknown as DocumentNode<OnboardingQuery, OnboardingQueryVariables>;
export const AddFeedbackDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddFeedback"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"AddFeedbackInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addFeedback"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<AddFeedbackMutation, AddFeedbackMutationVariables>;
export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"forgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ForgotPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const ImageGalleryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ImageGallery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageTypeOptionsEnum"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"images"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"camera"}},{"kind":"Field","name":{"kind":"Name","value":"aspectRatio"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"isExample"}},{"kind":"Field","name":{"kind":"Name","value":"originalImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<ImageGalleryQuery, ImageGalleryQueryVariables>;
export const VideoGalleryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"VideoGallery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"after"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videos"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"after"},"value":{"kind":"Variable","name":{"kind":"Name","value":"after"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"edges"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"node"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"negativePrompt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"videoUrl"}},{"kind":"Field","name":{"kind":"Name","value":"isExample"}},{"kind":"Field","name":{"kind":"Name","value":"originalImages"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnailUrl"}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"pageInfo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"endCursor"}},{"kind":"Field","name":{"kind":"Name","value":"hasNextPage"}}]}}]}}]}}]} as unknown as DocumentNode<VideoGalleryQuery, VideoGalleryQueryVariables>;
export const ImageCreationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImageCreation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageCreationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageCreation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<ImageCreationMutation, ImageCreationMutationVariables>;
export const ImageEditDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ImageEdit"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ImageEditInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"imageEdit"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prompt"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<ImageEditMutation, ImageEditMutationVariables>;
export const SignOutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SignOut"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signOut"}}]}}]} as unknown as DocumentNode<SignOutMutation, SignOutMutationVariables>;
export const ManageSubscriptionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ManageSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"customerPortalUrl"}}]}}]}}]} as unknown as DocumentNode<ManageSubscriptionQuery, ManageSubscriptionQueryVariables>;
export const SignInDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signIn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignInUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signIn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]} as unknown as DocumentNode<SignInMutation, SignInMutationVariables>;
export const ResetPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"resetPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResetPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"resetPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const UpdateUserPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateUserPasswordInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<UpdateUserPasswordMutation, UpdateUserPasswordMutationVariables>;
export const SignUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"signUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"SignUpUserInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"signUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}]}]}}]} as unknown as DocumentNode<SignUpMutation, SignUpMutationVariables>;
export const VideoCreationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VideoCreation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VideoCreationInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"videoCreation"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<VideoCreationMutation, VideoCreationMutationVariables>;
export const VirtualTryOnDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"VirtualTryOn"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"VirtualTryOnInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"virtualTryOn"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"imageUrl"}}]}}]}}]} as unknown as DocumentNode<VirtualTryOnMutation, VirtualTryOnMutationVariables>;