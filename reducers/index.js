import { uniqBy } from 'lodash';
import { handleActions } from 'redux-actions';

import * as Constants from '../constants';
import * as api from '../api';
import { toggleItem } from '../utils/toggleItem';

export const QUESTION_BANK_STATE_PATH = 'questionBank';

const initialState = {
  totalCount: Infinity,
  offset: api.initialPaginationOffset,
  currentTab: null,
  categories: [],
  questions: [],
  selectedQuestionIds: [],
};

export const questionBankReducer = handleActions(
  {
    [Constants.SET_CATEGORIES]: (state, { payload }) => {
      return {
        ...state,
        categories: payload,
      };
    },

    [Constants.SET_QUESTIONS]: (state, { payload }) => {
      return {
        ...state,
        questions: payload.questions,
        totalCount: payload.totalCount,
        offset: payload.questions.length,
        /* filter selected question ids that remain visible after search/category change */
        selectedQuestionIds: state.selectedQuestionIds.filter(questionId =>
          payload.questions.find(question => question.id === questionId),
        ),
      };
    },

    [Constants.SET_QUESTIONS_INCREMENTAL]: (state, { payload }) => {
      return {
        ...state,
        questions: uniqBy([...state.questions, ...payload.questions], 'id'),
        totalCount: payload.totalCount,
        offset: state.offset + payload.questions.length,
      };
    },

    [Constants.SELECT_QUESTION]: (state, { payload: questionId }) => {
      return {
        ...state,
        selectedQuestionIds: toggleItem(questionId, state.selectedQuestionIds),
      };
    },

    [Constants.SET_QUESTION_FAVORITE]: (
      state,
      { payload: { isFavorite, questionId } },
    ) => {
      return {
        ...state,
        questions: state.questions.map(
          question =>
            question.id === questionId ? { ...question, isFavorite } : question,
        ),
      };
    },

    [Constants.RESET_TAB_STATE]: state => {
      return {
        ...initialState,
        currentTab: state.currentTab,
      };
    },

    [Constants.RESET_QUESTION_BANK_STATE]: () => {
      return initialState;
    },

    [Constants.SET_CURRENT_TAB]: (state, { payload }) => {
      return {
        ...state,
        currentTab: payload,
      };
    },
  },
  initialState,
);

const getQuestionBankState = state => state[QUESTION_BANK_STATE_PATH];

export const categoriesSelector = state =>
  getQuestionBankState(state).categories;

export const questionsSelector = state => getQuestionBankState(state).questions;

export const totalQuestionsCountSelector = state =>
  getQuestionBankState(state).totalCount;

export const offsetSelector = state => getQuestionBankState(state).offset;

export const currentTabSelector = state =>
  getQuestionBankState(state).currentTab;

export const selectedQuestionIdsSelector = state =>
  getQuestionBankState(state).selectedQuestionIds;

export const selectors = {
  categoriesSelector,
  currentTabSelector,
  questionsSelector,
  totalQuestionsCountSelector,
  offsetSelector,
  selectedQuestionIdsSelector,
};
