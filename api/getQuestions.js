import axios from 'axios';
import { isEmpty, property } from 'lodash';

import { buildApiV2Url, jsonApiHeaders } from '../../../api/utils/apiUtils';
import { generateApiError } from '../../../api/utils/apiErrorMessages';
import { mapResponseFromApiModel } from './questionsDataMapper';
import { QUESTIONS_LOAD_BATCH_SIZE } from './apiConfig';

const toQuestionTagsSearchFilter = tags => {
  return !isEmpty(tags)
    ? {
        'topics.name': tags,
      }
    : {};
};

const toQuestionTitleSearchFilter = title => {
  return title
    ? {
        plain_text: {
          like: encodeURIComponent(`%${title.toLowerCase()}%`),
        },
      }
    : {};
};

const toIsOnlyFavoriteFilter = (onlyFavorites = false) => ({
  only_favorites: onlyFavorites,
  sort: '-updated_at',
});

export const getQuestions = ({
  limit = QUESTIONS_LOAD_BATCH_SIZE,
  offset = 0,
  selectedTags,
  search,
  onlyFavorite,
} = {}) => {
  const params = {
    include: 'topics',
    page: { limit, offset },
    filter: {
      ...toQuestionTagsSearchFilter(selectedTags),
      ...toQuestionTitleSearchFilter(search),
    },
    ...toIsOnlyFavoriteFilter(onlyFavorite),
  };

  return axios
    .get(buildApiV2Url('questions', params), {
      headers: jsonApiHeaders,
    })
    .catch(generateApiError())
    .then(property('data'))
    .then(mapResponseFromApiModel);
};
