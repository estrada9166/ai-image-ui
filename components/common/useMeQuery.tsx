import { RequestPolicy, useQuery } from "urql";
import { graphql } from "../../gql";

const MeQueryDocument = graphql(/* GraphQL */ `
  query Me {
    me {
      id
      fullName
      email
      isSocialLogin
      hasActiveSubscription
    }
  }
`);

export const useMeQuery = (requestPolicy?: RequestPolicy) => {
  const [{ data, fetching, error }] = useQuery({
    query: MeQueryDocument,
    requestPolicy,
  });

  return { data, fetching, error };
};
