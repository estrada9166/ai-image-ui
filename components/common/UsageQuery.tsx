import { useQuery } from "urql";
import { graphql } from "../../gql";

const UsageQueryDocument = graphql(/* GraphQL */ `
  query Usage {
    me {
      id
      planFeaturesUsage {
        planId
        startDate
        endDate
        imageCreation {
          limit
          used
        }
        editImage {
          limit
          used
        }
        imageRestoration {
          limit
          used
        }
        videoCreation {
          limit
          used
        }
      }
    }
  }
`);

export function UsageQuery() {
  const [{ data }] = useQuery({ query: UsageQueryDocument });

  return data;
}
