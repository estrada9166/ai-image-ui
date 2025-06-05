/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query ImageById($id: ID!) {\n    node(id: $id) {\n      __typename\n      ... on Image {\n        id\n        prompt\n        thumbnailUrl\n        imageUrl\n        originalImages {\n          id\n        }\n      }\n    }\n  }\n": typeof types.ImageByIdDocument,
    "\n  query Me {\n    me {\n      id\n      fullName\n      email\n      isSocialLogin\n      hasActiveSubscription\n    }\n  }\n": typeof types.MeDocument,
    "\n  query Usage {\n    me {\n      id\n      email\n      planFeaturesUsage {\n        planId\n        startDate\n        endDate\n        imageCreation {\n          limit\n          used\n        }\n        editImage {\n          limit\n          used\n        }\n        imageRestoration {\n          limit\n          used\n        }\n        videoCreation {\n          limit\n          used\n        }\n      }\n    }\n  }\n": typeof types.UsageDocument,
    "\n  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {\n    confirmUserEmail(input: $input) {\n      id\n    }\n  }\n": typeof types.ConfirmUserEmailDocument,
    "\n  query Onboarding {\n    me {\n      id\n      onboarding {\n        hasCreatedFirstImage\n        hasCreatedFirstVideo\n        hasCreatedFirstImageEdit\n      }\n    }\n  }\n": typeof types.OnboardingDocument,
    "\n  mutation AddFeedback($input: AddFeedbackInput!) {\n    addFeedback(input: $input)\n  }\n": typeof types.AddFeedbackDocument,
    "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input)\n  }\n": typeof types.ForgotPasswordDocument,
    "\n  query ImageGallery(\n    $first: Int\n    $after: String\n    $type: [ImageTypeOptionsEnum!]!\n  ) {\n    images(first: $first, after: $after, type: $type) {\n      edges {\n        node {\n          id\n          camera\n          aspectRatio\n          prompt\n          status\n          imageUrl\n          thumbnailUrl\n          model\n          isExample\n          originalImages {\n            id\n            imageUrl\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": typeof types.ImageGalleryDocument,
    "\n  query VideoGallery($first: Int, $after: String) {\n    videos(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          prompt\n          negativePrompt\n          status\n          videoUrl\n          isExample\n          originalImages {\n            id\n            thumbnailUrl\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": typeof types.VideoGalleryDocument,
    "\n  mutation ImageCreation($input: ImageCreationInput!) {\n    imageCreation(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n": typeof types.ImageCreationDocument,
    "\n  mutation ImageEdit($input: ImageEditInput!) {\n    imageEdit(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n": typeof types.ImageEditDocument,
    "\n  mutation SignOut {\n    signOut\n  }\n": typeof types.SignOutDocument,
    "\n  query ManageSubscription {\n    me {\n      id\n      customerPortalUrl\n    }\n  }\n": typeof types.ManageSubscriptionDocument,
    "\n  mutation signIn($input: SignInUserInput!) {\n    signIn(input: $input) {\n      id\n      email\n      fullName\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation resetPassword($input: ResetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n": typeof types.ResetPasswordDocument,
    "\n  mutation ImageRestore($input: ImageRestoreInput!) {\n    imageRestore(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n": typeof types.ImageRestoreDocument,
    "\n  mutation UpdateUserPassword($input: UpdateUserPasswordInput!) {\n    updateUserPassword(input: $input) {\n      id\n      email\n    }\n  }\n": typeof types.UpdateUserPasswordDocument,
    "\n  mutation signUp($input: SignUpUserInput!) {\n    signUp(input: $input)\n  }\n": typeof types.SignUpDocument,
    "\n  mutation VideoCreation($input: VideoCreationInput!) {\n    videoCreation(input: $input) {\n      id\n      status\n    }\n  }\n": typeof types.VideoCreationDocument,
};
const documents: Documents = {
    "\n  query ImageById($id: ID!) {\n    node(id: $id) {\n      __typename\n      ... on Image {\n        id\n        prompt\n        thumbnailUrl\n        imageUrl\n        originalImages {\n          id\n        }\n      }\n    }\n  }\n": types.ImageByIdDocument,
    "\n  query Me {\n    me {\n      id\n      fullName\n      email\n      isSocialLogin\n      hasActiveSubscription\n    }\n  }\n": types.MeDocument,
    "\n  query Usage {\n    me {\n      id\n      email\n      planFeaturesUsage {\n        planId\n        startDate\n        endDate\n        imageCreation {\n          limit\n          used\n        }\n        editImage {\n          limit\n          used\n        }\n        imageRestoration {\n          limit\n          used\n        }\n        videoCreation {\n          limit\n          used\n        }\n      }\n    }\n  }\n": types.UsageDocument,
    "\n  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {\n    confirmUserEmail(input: $input) {\n      id\n    }\n  }\n": types.ConfirmUserEmailDocument,
    "\n  query Onboarding {\n    me {\n      id\n      onboarding {\n        hasCreatedFirstImage\n        hasCreatedFirstVideo\n        hasCreatedFirstImageEdit\n      }\n    }\n  }\n": types.OnboardingDocument,
    "\n  mutation AddFeedback($input: AddFeedbackInput!) {\n    addFeedback(input: $input)\n  }\n": types.AddFeedbackDocument,
    "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input)\n  }\n": types.ForgotPasswordDocument,
    "\n  query ImageGallery(\n    $first: Int\n    $after: String\n    $type: [ImageTypeOptionsEnum!]!\n  ) {\n    images(first: $first, after: $after, type: $type) {\n      edges {\n        node {\n          id\n          camera\n          aspectRatio\n          prompt\n          status\n          imageUrl\n          thumbnailUrl\n          model\n          isExample\n          originalImages {\n            id\n            imageUrl\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": types.ImageGalleryDocument,
    "\n  query VideoGallery($first: Int, $after: String) {\n    videos(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          prompt\n          negativePrompt\n          status\n          videoUrl\n          isExample\n          originalImages {\n            id\n            thumbnailUrl\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": types.VideoGalleryDocument,
    "\n  mutation ImageCreation($input: ImageCreationInput!) {\n    imageCreation(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n": types.ImageCreationDocument,
    "\n  mutation ImageEdit($input: ImageEditInput!) {\n    imageEdit(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n": types.ImageEditDocument,
    "\n  mutation SignOut {\n    signOut\n  }\n": types.SignOutDocument,
    "\n  query ManageSubscription {\n    me {\n      id\n      customerPortalUrl\n    }\n  }\n": types.ManageSubscriptionDocument,
    "\n  mutation signIn($input: SignInUserInput!) {\n    signIn(input: $input) {\n      id\n      email\n      fullName\n    }\n  }\n": types.SignInDocument,
    "\n  mutation resetPassword($input: ResetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n": types.ResetPasswordDocument,
    "\n  mutation ImageRestore($input: ImageRestoreInput!) {\n    imageRestore(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n": types.ImageRestoreDocument,
    "\n  mutation UpdateUserPassword($input: UpdateUserPasswordInput!) {\n    updateUserPassword(input: $input) {\n      id\n      email\n    }\n  }\n": types.UpdateUserPasswordDocument,
    "\n  mutation signUp($input: SignUpUserInput!) {\n    signUp(input: $input)\n  }\n": types.SignUpDocument,
    "\n  mutation VideoCreation($input: VideoCreationInput!) {\n    videoCreation(input: $input) {\n      id\n      status\n    }\n  }\n": types.VideoCreationDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ImageById($id: ID!) {\n    node(id: $id) {\n      __typename\n      ... on Image {\n        id\n        prompt\n        thumbnailUrl\n        imageUrl\n        originalImages {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query ImageById($id: ID!) {\n    node(id: $id) {\n      __typename\n      ... on Image {\n        id\n        prompt\n        thumbnailUrl\n        imageUrl\n        originalImages {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Me {\n    me {\n      id\n      fullName\n      email\n      isSocialLogin\n      hasActiveSubscription\n    }\n  }\n"): (typeof documents)["\n  query Me {\n    me {\n      id\n      fullName\n      email\n      isSocialLogin\n      hasActiveSubscription\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Usage {\n    me {\n      id\n      email\n      planFeaturesUsage {\n        planId\n        startDate\n        endDate\n        imageCreation {\n          limit\n          used\n        }\n        editImage {\n          limit\n          used\n        }\n        imageRestoration {\n          limit\n          used\n        }\n        videoCreation {\n          limit\n          used\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query Usage {\n    me {\n      id\n      email\n      planFeaturesUsage {\n        planId\n        startDate\n        endDate\n        imageCreation {\n          limit\n          used\n        }\n        editImage {\n          limit\n          used\n        }\n        imageRestoration {\n          limit\n          used\n        }\n        videoCreation {\n          limit\n          used\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {\n    confirmUserEmail(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {\n    confirmUserEmail(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Onboarding {\n    me {\n      id\n      onboarding {\n        hasCreatedFirstImage\n        hasCreatedFirstVideo\n        hasCreatedFirstImageEdit\n      }\n    }\n  }\n"): (typeof documents)["\n  query Onboarding {\n    me {\n      id\n      onboarding {\n        hasCreatedFirstImage\n        hasCreatedFirstVideo\n        hasCreatedFirstImageEdit\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation AddFeedback($input: AddFeedbackInput!) {\n    addFeedback(input: $input)\n  }\n"): (typeof documents)["\n  mutation AddFeedback($input: AddFeedbackInput!) {\n    addFeedback(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input)\n  }\n"): (typeof documents)["\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ImageGallery(\n    $first: Int\n    $after: String\n    $type: [ImageTypeOptionsEnum!]!\n  ) {\n    images(first: $first, after: $after, type: $type) {\n      edges {\n        node {\n          id\n          camera\n          aspectRatio\n          prompt\n          status\n          imageUrl\n          thumbnailUrl\n          model\n          isExample\n          originalImages {\n            id\n            imageUrl\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query ImageGallery(\n    $first: Int\n    $after: String\n    $type: [ImageTypeOptionsEnum!]!\n  ) {\n    images(first: $first, after: $after, type: $type) {\n      edges {\n        node {\n          id\n          camera\n          aspectRatio\n          prompt\n          status\n          imageUrl\n          thumbnailUrl\n          model\n          isExample\n          originalImages {\n            id\n            imageUrl\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query VideoGallery($first: Int, $after: String) {\n    videos(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          prompt\n          negativePrompt\n          status\n          videoUrl\n          isExample\n          originalImages {\n            id\n            thumbnailUrl\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query VideoGallery($first: Int, $after: String) {\n    videos(first: $first, after: $after) {\n      edges {\n        node {\n          id\n          prompt\n          negativePrompt\n          status\n          videoUrl\n          isExample\n          originalImages {\n            id\n            thumbnailUrl\n          }\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ImageCreation($input: ImageCreationInput!) {\n    imageCreation(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation ImageCreation($input: ImageCreationInput!) {\n    imageCreation(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ImageEdit($input: ImageEditInput!) {\n    imageEdit(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation ImageEdit($input: ImageEditInput!) {\n    imageEdit(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignOut {\n    signOut\n  }\n"): (typeof documents)["\n  mutation SignOut {\n    signOut\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ManageSubscription {\n    me {\n      id\n      customerPortalUrl\n    }\n  }\n"): (typeof documents)["\n  query ManageSubscription {\n    me {\n      id\n      customerPortalUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation signIn($input: SignInUserInput!) {\n    signIn(input: $input) {\n      id\n      email\n      fullName\n    }\n  }\n"): (typeof documents)["\n  mutation signIn($input: SignInUserInput!) {\n    signIn(input: $input) {\n      id\n      email\n      fullName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation resetPassword($input: ResetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n"): (typeof documents)["\n  mutation resetPassword($input: ResetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ImageRestore($input: ImageRestoreInput!) {\n    imageRestore(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation ImageRestore($input: ImageRestoreInput!) {\n    imageRestore(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateUserPassword($input: UpdateUserPasswordInput!) {\n    updateUserPassword(input: $input) {\n      id\n      email\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateUserPassword($input: UpdateUserPasswordInput!) {\n    updateUserPassword(input: $input) {\n      id\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation signUp($input: SignUpUserInput!) {\n    signUp(input: $input)\n  }\n"): (typeof documents)["\n  mutation signUp($input: SignUpUserInput!) {\n    signUp(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VideoCreation($input: VideoCreationInput!) {\n    videoCreation(input: $input) {\n      id\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation VideoCreation($input: VideoCreationInput!) {\n    videoCreation(input: $input) {\n      id\n      status\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;