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
        onlyFavorite: true,
        tab: tabTypes.FAVORITES,
      }),
    ),
  onSearchChange: ({ selectedTags, search } = {}) =>
    dispatch(
      actions.searchQuestions({
        selectedTags,
        search,
        onlyFavorite: true,
        tab: tabTypes.FAVORITES,
      }),
    ),
  onTagsChange: ({ selectedTags, search } = {}) =>
    dispatch(
      actions.getQuestionsByTag({
        selectedTags,
        search,
        onlyFavorite: true,
        tab: tabTypes.FAVORITES,
      }),
    ),
});

const FavoriteQuestionsTab = compose(
  withCommonTabProps,
  connect(
    null,
    mapDispatchToProps,
  ),
)(Tab);

FavoriteQuestionsTab.propTypes = {
  activeEntityUrl: PropTypes.string,
  loadEntity: PropTypes.func.isRequired,
};

export { FavoriteQuestionsTab };
