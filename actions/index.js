import { createAction } from 'redux-actions';
import { debounce } from 'lodash';

import { DEFAULT_DEBOUNCE_TIME } from 'sharedParts';
import { handleApiErrors } from 'actions/actionsUtils';
import coreActions from 'constants/actions';
import * as api from '../api';
import * as Constants from '../constants';

const { API } = coreActions;

export const setQuestionsIncremental = createAction(
  Constants.SET_QUESTIONS_INCREMENTAL,
);
export const setCategories = createAction(Constants.SET_CATEGORIES);
export const setQuestions = createAction(Constants.SET_QUESTIONS);
export const selectQuestion = createAction(Constants.SELECT_QUESTION);
export const setCurrentTab = createAction(Constants.SET_CURRENT_TAB);
export const resetTabState = createAction(Constants.RESET_TAB_STATE);
export const resetQuestionBankState = createAction(
  Constants.RESET_QUESTION_BANK_STATE,
);
export const setQuestionFavorite = createAction(
  Constants.SET_QUESTION_FAVORITE,
);

export const getCategories = () => ({
  type: API,
  types: [
    Constants.GET_CATEGORIES_REQUEST,
    Constants.GET_CATEGORIES_SUCCESS,
    Constants.GET_CATEGORIES_FAILURE,
  ],
  api: api.getCategories,
  params: [],
});

export const getQuestions = ({
  selectedTags,
  search,
  offset,
  onlyFavorite,
  tab,
  recent = false,
}) => ({
  type: API,
  types: [
    Constants.GET_QUESTIONS_REQUEST,
    Constants.GET_QUESTIONS_SUCCESS,
    Constants.GET_QUESTIONS_FAILURE,
  ],
  api: recent ? api.getRecentQuestions : api.getQuestions,
  params: [{ onlyFavorite, selectedTags, search, offset }],
  tab,
});

export const searchQuestions = ({
  selectedTags,
  search,
  tab,
  recent = false,
  onlyFavorite = false,
}) => ({
  type: API,
  types: [
    Constants.SEARCH_QUESTIONS_REQUEST,
    Constants.SEARCH_QUESTIONS_SUCCESS,
    Constants.SEARCH_QUESTIONS_FAILURE,
  ],
  api: recent ? api.getRecentQuestions : api.getQuestions,
  params: [
    {
      onlyFavorite,
      selectedTags,
      search,
      offset: api.initialPaginationOffset,
    },
  ],
  tab,
});

export const getQuestionsByTag = ({
  selectedTags,
  search,
  tab,
  recent = false,
  onlyFavorite = false,
}) => ({
  type: API,
  types: [
    Constants.GET_QUESTIONS_BY_TAG_REQUEST,
    Constants.GET_QUESTIONS_BY_TAG_SUCCESS,
    Constants.GET_QUESTIONS_BY_TAG_FAILURE,
  ],
  api: recent ? api.getRecentQuestions : api.getQuestions,
  params: [
    {
      onlyFavorite,
      selectedTags,
      search,
      offset: api.initialPaginationOffset,
    },
  ],
  tab,
});

export const addQuestions = ({ entityId, selectedQuestionIds }) => dispatch => {
  return api
    .postQuestions({ entityId, selectedQuestionIds })
    .catch(rejection => dispatch(handleApiErrors(rejection)));
};

const toggleFavoriteQuestionRequest = debounce((questionId, isFavorite) => {
  api.favoriteQuestion(questionId, isFavorite).catch(rejection => {
    dispatch(setQuestionFavorite({ questionId, isFavorite: !isFavorite }));
    dispatch(handleApiErrors(rejection));
  });
}, DEFAULT_DEBOUNCE_TIME);

export const toggleFavoriteQuestion = (questionId, isFavorite) => dispatch => {
  dispatch(setQuestionFavorite({ questionId, isFavorite }));

  toggleFavoriteQuestionRequest(questionId, isFavorite);
};
