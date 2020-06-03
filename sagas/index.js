import { all, put, select, takeEvery } from 'redux-saga/effects';

import { handleApiErrors } from 'actions/actionsUtils';
import * as actions from '../actions';
import * as Constants from '../constants';
import * as selectors from '../reducers';

const isDataForClosedTab = (tab, currentTab) =>
  Boolean(currentTab && tab !== currentTab);

function* onGetCategoriesSuccess({ data: categories }) {
  yield put(actions.setCategories(categories));
}

function* onGetQuestionsSuccess({ data, tab }) {
  const currentTab = yield select(selectors.currentTabSelector);

  if (isDataForClosedTab(tab, currentTab)) {
    return;
  }

  yield put(
    actions.setQuestionsIncremental({
      questions: data.questions,
      totalCount: data.totalCount,
    }),
  );
}

function* onGetQuestionsByQuerySuccess({ data, tab }) {
  const currentTab = yield select(selectors.currentTabSelector);

  if (isDataForClosedTab(tab, currentTab)) {
    return;
  }

  yield put(
    actions.setQuestions({
      questions: data.questions,
      totalCount: data.totalCount,
    }),
  );
}

function* onFailure(rejection) {
  yield put(handleApiErrors(rejection));
}

function* onQuestionsByTagRequest() {
  yield put(
    actions.setQuestions({
      questions: [],
      totalCount: 0,
    }),
  );
}

export default function*() {
  yield all([
    takeEvery(Constants.GET_QUESTIONS_BY_TAG_REQUEST, onQuestionsByTagRequest),
    takeEvery(Constants.GET_CATEGORIES_SUCCESS, onGetCategoriesSuccess),
    takeEvery(Constants.GET_QUESTIONS_SUCCESS, onGetQuestionsSuccess),
    takeEvery(
      [
        Constants.SEARCH_QUESTIONS_SUCCESS,
        Constants.GET_QUESTIONS_BY_TAG_SUCCESS,
      ],
      onGetQuestionsByQuerySuccess,
    ),
    takeEvery(
      [
        Constants.GET_CATEGORIES_FAILURE,
        Constants.GET_QUESTIONS_FAILURE,
        Constants.SEARCH_QUESTIONS_FAILURE,
        Constants.GET_QUESTIONS_BY_TAG_FAILURE,
      ],
      onFailure,
    ),
  ]);
}
