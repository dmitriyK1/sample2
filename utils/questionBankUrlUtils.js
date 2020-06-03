import qs from 'qs';
import { isEmpty } from 'lodash';

import mapEditorSectionToUrl from '../../../config/mapEditorSectionToUrl';
import { QUESTION_BANK_SLUG } from '../config';

const removeTrailingSlash = path => path.replace(/\/$/, '');

export const isQuestionBankUrl = url =>
  url.includes(`/${mapEditorSectionToUrl.survey}/${QUESTION_BANK_SLUG}`);

export const getBankUrl = path =>
  `${removeTrailingSlash(path)}/${QUESTION_BANK_SLUG}`;

export const getActiveEntityUrl = path =>
  removeTrailingSlash(path).replace(`/${QUESTION_BANK_SLUG}`, '');

export const stringifyTags = selectedTags => {
  return !isEmpty(selectedTags) ? qs.stringify({ tags: selectedTags }) : '';
};

export const getTagsFromUrlParams = () => {
  const { tags } = qs.parse(window.location.search.replace('?', ''));

  return isEmpty(tags) ? [] : tags;
};

export const removeTabSlugFromUrl = (tabSlug, url) => {
  return tabSlug ? url.replace(tabSlug, '') : url;
};
