import { connect } from 'react-redux';

import { navigate } from 'actions/appActions';
import * as actions from '../actions';
import { getActiveEditorEntityId } from '../../../reducers';
import { selectors } from '../reducers';

const mapStateToProps = state => ({
  entityId: getActiveEditorEntityId(state),
  categories: selectors.categoriesSelector(state),
  questions: selectors.questionsSelector(state),
  totalCount: selectors.totalQuestionsCountSelector(state),
  offset: selectors.offsetSelector(state),
  selectedQuestionIds: selectors.selectedQuestionIdsSelector(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  addQuestions: async (entityId, selectedQuestionIds) => {
    await dispatch(actions.addQuestions({ entityId, selectedQuestionIds }));

    ownProps.loadEntity(entityId);
    dispatch(navigate(ownProps.activeEntityUrl));
  },
  navigateToUrl: url => dispatch(navigate(url)),
  getCategories: () => dispatch(actions.getCategories()),
  selectQuestion: questionId => dispatch(actions.selectQuestion(questionId)),
  toggleFavorite: (questionId, isFavorite) =>
    dispatch(actions.toggleFavoriteQuestion(questionId, isFavorite)),
});

export const withCommonTabProps = connect(
  mapStateToProps,
  mapDispatchToProps,
);
