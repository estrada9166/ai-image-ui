import { Client, fetchExchange, ssrExchange } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { relayPagination } from "@urql/exchange-graphcache/extras";

export function createUrqlClient(cookie?: string) {
  const cache = cacheExchange({
    keys: {
      UsageLimit: () => null,
      PlanFeaturesUsage: () => null,
      Onboarding: () => null,
    },
    resolvers: {
      Query: {
        images: relayPagination(),
        videos: relayPagination(),
      },
    },
  });

  const exchange = [cache];

  if (cookie) {
    const ssr = ssrExchange({ isClient: false });
    exchange.push(ssr);
  }

  exchange.push(fetchExchange);

  return new Client({
    url: `${process.env.NEXT_PUBLIC_SERVER_URL!}/graphql`,
    fetchOptions: {
      credentials: "include",
      // Forward the incoming cookie here:
      headers: {
        cookie: cookie || "",
      },
    },
    exchanges: exchange,
  });
}
