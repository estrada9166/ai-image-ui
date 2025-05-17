import { graphql } from "../../gql";

export const MeQueryDocument = graphql(/* GraphQL */ `
  query Me {
    me {
      id
      fullName
      email
      isSocialLogin
    }
  }
`);
