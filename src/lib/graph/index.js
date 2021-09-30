export async function simplyFetchFromGraph2({ uri= `${process.env.NEXT_PUBLIC_SERVICE_API_CATALOGUE_URL}`, query, variables }) {
  const body = JSON.stringify({ query, variables })
  try {

  const response = await fetch(uri, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }
  const json = await response.json();
  if (json.errors) {
    console.error('Service API encountered an error', json.errors);
  }
  return json;
  } catch (e){
    throw new Error(`Unfortunately, we ran into problems while querying the product`)
  }
}

export function simplyFetchFromSearchGraph(args) {
  return simplyFetchFromGraph2({
    uri: `${process.env.NEXT_PUBLIC_SERVICE_API_SEARCH_URL}`,
    ...args
  });
}
