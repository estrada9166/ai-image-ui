import { useQuery } from "urql";
import { graphql } from "../../gql";

const useUsageQueryDocument = graphql(/* GraphQL */ `
  query Usage {
    me {
      id
      email
      planFeaturesUsage {
        planId
        startDate
        endDate
        images {
          limit
          used
        }
        videos {
          limit
          used
        }
      }
    }
  }
`);

export function useUsageQuery() {
  const [{ data, fetching, error }, reexecuteQuery] = useQuery({
    query: useUsageQueryDocument,
  });

  return { data, fetching, error, reexecuteQuery };
}
