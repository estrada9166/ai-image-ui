export const generatePlanUrl = (
  planUrl: string,
  client_reference_id: string,
  prefilled_email: string
) => {
  const queryParams = new URLSearchParams({
    client_reference_id,
    prefilled_email,
  });

  return `${planUrl}?${queryParams.toString()}`;
};
