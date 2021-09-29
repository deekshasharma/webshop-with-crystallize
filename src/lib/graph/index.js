/**
 * Helper for getting a catalogue item with a path
 * from url, removing any query params from the variables
 */
export function safePathQuery({ variables, ...rest }) {
  if (variables && 'path' in variables) {
    const safePath = (variables.path || '')
      .split('?')[0]
      .split('#')[0]
      .replace(/\/$/, '');

    return {
      variables: {
        ...variables,
        path: safePath
      },
      ...rest
    };
  }

  return {
    variables,
    ...rest
  };
}

export async function simplyFetchFromGraph({
  uri = `https://api.crystallize.com/${process.env.NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER}/catalogue`,
  query,
  variables
}) {
  const body = JSON.stringify(safePathQuery({ query, variables }));

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

  return response.json();
}

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
  return simplyFetchFromGraph({
    uri: `https://api.crystallize.com/${process.env.NEXT_PUBLIC_CRYSTALLIZE_TENANT_IDENTIFIER}/search`,
    ...args
  });
}
