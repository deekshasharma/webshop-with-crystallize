import { simplyFetchFromGraph2 } from 'lib/graph';
import { QUERY_FOLDER } from './query';

export async function getData({ asPath, language, preview = null }) {
  const { data } = await simplyFetchFromGraph2({
    uri:`${process.env.NEXT_PUBLIC_SERVICE_NON_GRAPHQL_API_URL}/api/products/get-folder`,
    query: QUERY_FOLDER,
    variables: {
      path: asPath,
      language,
      version: preview ? 'draft' : 'published'
    }
  });

  return { ...data, preview };
}
