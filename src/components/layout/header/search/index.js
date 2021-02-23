import React, { useReducer, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import produce from 'immer';

import { useT } from 'lib/i18n';
import { simplyFetchFromSearchGraph } from 'lib/graph';
import { SEARCH_QUERY } from 'lib/search';
import { useLocale } from 'lib/app-config';

import { Btn } from './../styles';
import { Input, InputGroup, InputButton, InputSpinner } from 'ui';
import {
  Outer,
  SearchWrapper,
  SearchLabel,
  BodyOverlay,
  CloseBtn,
  Result
} from './styles';

const initialState = {
  searchTerm: '',
  status: 'idle',
  isOpen: false,
  searchResult: {
    totalCount: 0,
    edges: []
  }
};

const searchReducer = produce(function reducer(draft, { action, ...rest }) {
  switch (action) {
    case 'setSearchTerm': {
      const { value } = rest;
      if (value.length > 0) {
        draft.status = 'searching';
      }

      draft.searchTerm = value;
      break;
    }
    case 'setResult': {
      const { search, aggregations } = rest;
      draft.searchResult.edges = search.edges;
      draft.searchResult.totalCount = aggregations.aggregations.totalResults;
      draft.status = 'got-results';
      break;
    }
    case 'focus': {
      draft.isOpen = true;
      break;
    }
    case 'blur': {
      if (draft.isOpen) {
        draft.isOpen = false;
        document.activeElement.blur();
      }
      break;
    }
    default: {
      throw new Error(`Action ${action} not supported`);
    }
  }
});

export default function Search() {
  const t = useT();
  const router = useRouter();
  const outerRef = useRef();
  const searchInput = useRef();
  const locale = useLocale();

  const [{ searchTerm, status, searchResult, isOpen }, dispatch] = useReducer(
    searchReducer,
    initialState
  );

  function onClickSearchBtn() {
    dispatch({ action: 'focus' });
    searchInput.current.focus();
  }

  // Do new search
  useEffect(() => {
    async function doSearch() {
      const filter = { searchTerm, productVariants: { isDefault: true } };
      const response = await simplyFetchFromSearchGraph({
        query: SEARCH_QUERY,
        variables: {
          filter,
          aggregationsFilter: filter,
          language: locale.crystallizeCatalogueLanguage
        }
      });

      dispatch({ action: 'setResult', ...response.data });
    }

    if (status === 'searching') {
      doSearch();
    }
  }, [searchTerm, status, locale]);

  function onSubmit(e) {
    e.preventDefault();

    const options = {
      pathname: '/search'
    };
    if (searchTerm) {
      options.query = { searchTerm };
    }

    if (router.pathname === '/search') {
      router.replace(options, undefined, { shallow: true });
    } else {
      router.push(options);
    }

    dispatch({ action: 'blur' });
  }

  return (
    <>
      <Btn type="button" onClick={onClickSearchBtn} aria-label="Search">
        <svg id="Icon" enableBackground="new 0 0 96 96" height="512" viewBox="0 0 96 96" width="512" xmlns="http://www.w3.org/2000/svg"><path id="Search" d="m49.557 18.444c.781.781.781 2.047 0 2.828-.391.391-.902.586-1.414.586s-1.023-.195-1.414-.586c-7.02-7.019-18.438-7.019-25.457 0-.781.781-2.047.781-2.828 0s-.781-2.047 0-2.828c8.577-8.578 22.535-8.578 31.113 0zm40.443 63.556c0 2.137-.832 4.146-2.344 5.656-1.51 1.512-3.519 2.344-5.656 2.344s-4.146-.832-5.656-2.344l-21-21c-.781-.781-.781-2.047 0-2.828l2.828-2.828-4.435-4.435c-5.28 4.623-12.184 7.435-19.737 7.435-16.542 0-30-13.458-30-30s13.458-30 30-30 30 13.458 30 30c0 7.553-2.812 14.457-7.435 19.737l4.435 4.435 2.828-2.828c.781-.781 2.047-.781 2.828 0l21 21c1.512 1.51 2.344 3.519 2.344 5.656zm-30-48c0-14.336-11.663-26-26-26s-26 11.664-26 26 11.663 26 26 26 26-11.664 26-26zm26 48c0-1.068-.416-2.072-1.172-2.828l-19.586-19.586-5.656 5.656 19.586 19.586c1.512 1.512 4.145 1.512 5.656 0 .756-.756 1.172-1.76 1.172-2.828z"/></svg>
      </Btn>
      <SearchWrapper isOpen={isOpen}>
        <Outer ref={outerRef}>
          <SearchLabel>{t('layout.searchPlaceholder')}</SearchLabel>
          <InputGroup as="form" method="get" role="search" onSubmit={onSubmit}>
            <Input
              ref={searchInput}
              type="search"
              value={searchTerm}
              onFocus={() => dispatch({ action: 'focus' })}
              onChange={(e) =>
                dispatch({ action: 'setSearchTerm', value: e.target.value })
              }
              placeholder={t('layout.searchPlaceholder')}
              aria-label={t('search.label')}
            />
            {status === 'searching' && <InputSpinner />}
            <InputButton>➔</InputButton>
          </InputGroup>
          {status !== 'idle' && isOpen && searchTerm !== '' && (
            <Result>
              <h3>{searchResult.totalCount} suggestions</h3>
              <ul style={{ height: 40 * (searchResult.edges.length + 1) }}>
                {searchResult.edges.map(({ cursor, node }) => (
                  <li key={cursor}>
                    <Link
                      href={node.path}
                      onClick={() => dispatch({ action: 'blue' })}
                    >
                      <a>{node.name}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </Result>
          )}
        </Outer>
        <CloseBtn onClick={() => dispatch({ action: 'blur' })} />
      </SearchWrapper>
      {!!isOpen && <BodyOverlay onClick={() => dispatch({ action: 'blur' })} />}
    </>
  );
}
