import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../../actions';
import { Tab } from '../../components/Tab';
import { withCommonTabProps } from '../../hocs/withCommonTabProps';
import { tabTypes } from '../../config';

const mapDispatchToProps = dispatch => ({
  getQuestions: ({ selectedTags, search, offset } = {}) =>
    dispatch(
      actions.getQuestions({ selectedTags, search, offset, tab: tabTypes.ALL }),
    ),
  onSearchChange: ({ selectedTags, search } = {}) =>
    dispatch(
      actions.searchQuestions({ selectedTags, search, tab: tabTypes.ALL }),
    ),
  onTagsChange: ({ selectedTags, search } = {}) =>
    dispatch(
      actions.getQuestionsByTag({ selectedTags, search, tab: tabTypes.ALL }),
    ),
});

const AllQuestionsTab = compose(
  withCommonTabProps,
  connect(
    null,
    mapDispatchToProps,
  ),
)(Tab);

AllQuestionsTab.propTypes = {
  activeEntityUrl: PropTypes.string,
  loadEntity: PropTypes.func.isRequired,
};

export { AllQuestionsTab };
