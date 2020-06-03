import axios from 'axios';
import { isEmpty, property } from 'lodash';

import { buildApiV2Url, jsonApiHeaders } from '../../../api/utils/apiUtils';
import { generateApiError } from '../../../api/utils/apiErrorMessages';
import { mapResponseFromApiModel } from './recentQuestionsDataMapper';
import { QUESTIONS_LOAD_BATCH_SIZE } from './apiConfig';

const toQuestionTagsSearchFilter = tags => {
  return !isEmpty(tags)
    ? {
        'questions.topics.name': tags,
      }
    : {};
};

const toQuestionTitleSearchFilter = title => {
  return title
    ? {
        'questions.plain_text': {
          like: encodeURIComponent(`%${title.toLowerCase()}%`),
        },
      }
    : {};
};

export const getRecentQuestions = ({
  limit = QUESTIONS_LOAD_BATCH_SIZE,
  offset = 0,
  selectedTags,
  search,
} = {}) => {
  const params = {
    include: ['questions', 'questions.topics'],
    page: { limit, offset },
    sort: '-used_at',
    filter: {
      ...toQuestionTagsSearchFilter(selectedTags),
      ...toQuestionTitleSearchFilter(search),
    },
  };

  return axios
    .get(buildApiV2Url('recent_questions', params), {
      headers: jsonApiHeaders,
    })
    .catch(generateApiError())
    .then(property('data'))
    .then(mapResponseFromApiModel);
};
