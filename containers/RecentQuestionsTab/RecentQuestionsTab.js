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
      actions.getQuestions({
        selectedTags,
        search,
        offset,
        recent: true,
        tab: tabTypes.RECENT,
      }),
    ),
  onSearchChange: ({ selectedTags, search } = {}) =>
    dispatch(
      actions.searchQuestions({
        selectedTags,
        search,
        recent: true,
        tab: tabTypes.RECENT,
      }),
    ),
  onTagsChange: ({ selectedTags, search } = {}) =>
    dispatch(
      actions.getQuestionsByTag({
        selectedTags,
        search,
        recent: true,
        tab: tabTypes.RECENT,
      }),
    ),
});

const RecentQuestionsTab = compose(
  withCommonTabProps,
  connect(
    null,
    mapDispatchToProps,
  ),
)(Tab);

RecentQuestionsTab.propTypes = {
  activeEntityUrl: PropTypes.string,
  loadEntity: PropTypes.func.isRequired,
};

export { RecentQuestionsTab };
