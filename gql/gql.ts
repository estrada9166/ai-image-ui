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
    "\n  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {\n    confirmUserEmail(input: $input) {\n      id\n    }\n  }\n": typeof types.ConfirmUserEmailDocument,
    "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input)\n  }\n": typeof types.ForgotPasswordDocument,
    "\n  mutation ImageCreation($input: ImageCreationInput!) {\n    imageCreation(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n": typeof types.ImageCreationDocument,
    "\n  query ImageGallery(\n    $first: Int\n    $after: String\n    $type: ImageTypeOptionsEnum!\n  ) {\n    images(first: $first, after: $after, type: $type) {\n      edges {\n        node {\n          id\n          prompt\n          status\n          imageUrl\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": typeof types.ImageGalleryDocument,
    "\n  query SidebarQuery {\n    me {\n      id\n      fullName\n      email\n    }\n  }\n": typeof types.SidebarQueryDocument,
    "\n  mutation SignOut {\n    signOut\n  }\n": typeof types.SignOutDocument,
    "\n  query CustomerPortalUrlQuery {\n    me {\n      id\n    }\n  }\n": typeof types.CustomerPortalUrlQueryDocument,
    "\n  mutation signIn($input: SignInUserInput!) {\n    signIn(input: $input) {\n      id\n      email\n      fullName\n    }\n  }\n": typeof types.SignInDocument,
    "\n  mutation EditImage($input: ImageEditInput!) {\n    imageEdit(input: $input) {\n      id\n      imageUrl\n      prompt\n      status\n    }\n  }\n": typeof types.EditImageDocument,
    "\n  query redirectIfUser {\n    me {\n      id\n    }\n  }\n": typeof types.RedirectIfUserDocument,
    "\n  query requireSignIn {\n    me {\n      id\n    }\n  }\n": typeof types.RequireSignInDocument,
    "\n  mutation resetPassword($input: ResetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n": typeof types.ResetPasswordDocument,
    "\n  mutation signUp($input: SignUpUserInput!) {\n    signUp(input: $input)\n  }\n": typeof types.SignUpDocument,
    "\n  query ImageById($id: ID!) {\n    node(id: $id) {\n      ... on Image {\n        id\n        prompt\n        imageUrl\n      }\n    }\n  }\n": typeof types.ImageByIdDocument,
    "\n  mutation VideoCreation($input: VideoCreationInput!) {\n    videoCreation(input: $input)\n  }\n": typeof types.VideoCreationDocument,
};
const documents: Documents = {
    "\n  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {\n    confirmUserEmail(input: $input) {\n      id\n    }\n  }\n": types.ConfirmUserEmailDocument,
    "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input)\n  }\n": types.ForgotPasswordDocument,
    "\n  mutation ImageCreation($input: ImageCreationInput!) {\n    imageCreation(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n": types.ImageCreationDocument,
    "\n  query ImageGallery(\n    $first: Int\n    $after: String\n    $type: ImageTypeOptionsEnum!\n  ) {\n    images(first: $first, after: $after, type: $type) {\n      edges {\n        node {\n          id\n          prompt\n          status\n          imageUrl\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n": types.ImageGalleryDocument,
    "\n  query SidebarQuery {\n    me {\n      id\n      fullName\n      email\n    }\n  }\n": types.SidebarQueryDocument,
    "\n  mutation SignOut {\n    signOut\n  }\n": types.SignOutDocument,
    "\n  query CustomerPortalUrlQuery {\n    me {\n      id\n    }\n  }\n": types.CustomerPortalUrlQueryDocument,
    "\n  mutation signIn($input: SignInUserInput!) {\n    signIn(input: $input) {\n      id\n      email\n      fullName\n    }\n  }\n": types.SignInDocument,
    "\n  mutation EditImage($input: ImageEditInput!) {\n    imageEdit(input: $input) {\n      id\n      imageUrl\n      prompt\n      status\n    }\n  }\n": types.EditImageDocument,
    "\n  query redirectIfUser {\n    me {\n      id\n    }\n  }\n": types.RedirectIfUserDocument,
    "\n  query requireSignIn {\n    me {\n      id\n    }\n  }\n": types.RequireSignInDocument,
    "\n  mutation resetPassword($input: ResetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n": types.ResetPasswordDocument,
    "\n  mutation signUp($input: SignUpUserInput!) {\n    signUp(input: $input)\n  }\n": types.SignUpDocument,
    "\n  query ImageById($id: ID!) {\n    node(id: $id) {\n      ... on Image {\n        id\n        prompt\n        imageUrl\n      }\n    }\n  }\n": types.ImageByIdDocument,
    "\n  mutation VideoCreation($input: VideoCreationInput!) {\n    videoCreation(input: $input)\n  }\n": types.VideoCreationDocument,
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
export function graphql(source: "\n  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {\n    confirmUserEmail(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation ConfirmUserEmail($input: ConfirmUserEmailInput!) {\n    confirmUserEmail(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input)\n  }\n"): (typeof documents)["\n  mutation forgotPassword($input: ForgotPasswordInput!) {\n    forgotPassword(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation ImageCreation($input: ImageCreationInput!) {\n    imageCreation(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n"): (typeof documents)["\n  mutation ImageCreation($input: ImageCreationInput!) {\n    imageCreation(input: $input) {\n      id\n      prompt\n      status\n      imageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ImageGallery(\n    $first: Int\n    $after: String\n    $type: ImageTypeOptionsEnum!\n  ) {\n    images(first: $first, after: $after, type: $type) {\n      edges {\n        node {\n          id\n          prompt\n          status\n          imageUrl\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"): (typeof documents)["\n  query ImageGallery(\n    $first: Int\n    $after: String\n    $type: ImageTypeOptionsEnum!\n  ) {\n    images(first: $first, after: $after, type: $type) {\n      edges {\n        node {\n          id\n          prompt\n          status\n          imageUrl\n        }\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SidebarQuery {\n    me {\n      id\n      fullName\n      email\n    }\n  }\n"): (typeof documents)["\n  query SidebarQuery {\n    me {\n      id\n      fullName\n      email\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation SignOut {\n    signOut\n  }\n"): (typeof documents)["\n  mutation SignOut {\n    signOut\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query CustomerPortalUrlQuery {\n    me {\n      id\n    }\n  }\n"): (typeof documents)["\n  query CustomerPortalUrlQuery {\n    me {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation signIn($input: SignInUserInput!) {\n    signIn(input: $input) {\n      id\n      email\n      fullName\n    }\n  }\n"): (typeof documents)["\n  mutation signIn($input: SignInUserInput!) {\n    signIn(input: $input) {\n      id\n      email\n      fullName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation EditImage($input: ImageEditInput!) {\n    imageEdit(input: $input) {\n      id\n      imageUrl\n      prompt\n      status\n    }\n  }\n"): (typeof documents)["\n  mutation EditImage($input: ImageEditInput!) {\n    imageEdit(input: $input) {\n      id\n      imageUrl\n      prompt\n      status\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query redirectIfUser {\n    me {\n      id\n    }\n  }\n"): (typeof documents)["\n  query redirectIfUser {\n    me {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query requireSignIn {\n    me {\n      id\n    }\n  }\n"): (typeof documents)["\n  query requireSignIn {\n    me {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation resetPassword($input: ResetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n"): (typeof documents)["\n  mutation resetPassword($input: ResetPasswordInput!) {\n    resetPassword(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation signUp($input: SignUpUserInput!) {\n    signUp(input: $input)\n  }\n"): (typeof documents)["\n  mutation signUp($input: SignUpUserInput!) {\n    signUp(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ImageById($id: ID!) {\n    node(id: $id) {\n      ... on Image {\n        id\n        prompt\n        imageUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query ImageById($id: ID!) {\n    node(id: $id) {\n      ... on Image {\n        id\n        prompt\n        imageUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation VideoCreation($input: VideoCreationInput!) {\n    videoCreation(input: $input)\n  }\n"): (typeof documents)["\n  mutation VideoCreation($input: VideoCreationInput!) {\n    videoCreation(input: $input)\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;