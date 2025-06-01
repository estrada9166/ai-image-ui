import { graphql } from "../../gql";

export const ImageByIdQuery = graphql(/* GraphQL */ `
  query ImageById($id: ID!) {
    node(id: $id) {
      ... on Image {
        id
        prompt
        thumbnailUrl
        imageUrl
        originalImages {
          id
        }
      }
    }
  }
`);
