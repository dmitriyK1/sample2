import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { navigate } from 'actions/appActions';
import { loadSurvey, loadTemplate } from 'actions/surveyEditorActions';
import { getActiveEntityType } from '../../../../reducers';
import QuestionBank from '../../components/QuestionBank';
import {
  getActiveEntityUrl,
  removeTabSlugFromUrl,
} from '../../utils/questionBankUrlUtils';
import { SURVEY_TYPE } from '../../../../config/EntityTypeList';
import * as actions from '../../actions';

class QuestionBankContainer extends React.Component {
  static propTypes = {
    activeEntityUrl: PropTypes.string,
    tabName: PropTypes.string,
    loadEntity: PropTypes.func.isRequired,
    navigateToUrl: PropTypes.func.isRequired,
    onTabChange: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
  };

  render() {
    return (
      <QuestionBank
        activeEntityUrl={this.props.activeEntityUrl}
        tabName={this.props.tabName}
        navigateToUrl={this.props.navigateToUrl}
        loadEntity={this.props.loadEntity}
        onTabChange={this.props.onTabChange}
        resetState={this.props.resetState}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { tabName } = ownProps.match.params;

  return {
    tabName,
    activeEntityUrl: getActiveEntityUrl(
      removeTabSlugFromUrl(tabName, ownProps.match.url),
    ),
    isSurvey: getActiveEntityType(state) === SURVEY_TYPE,
  };
};

const mapDispatchToProps = dispatch => ({
  resetState: () => dispatch(actions.resetQuestionBankState()),
  navigateToUrl: url => dispatch(navigate(url)),
  loadSurvey: surveyId => dispatch(loadSurvey(surveyId)),
  loadTemplate: templateId => dispatch(loadTemplate(templateId)),
  onTabChange: tabName => {
    dispatch(actions.resetTabState());
    dispatch(actions.setCurrentTab(tabName));
  },
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  loadEntity: stateProps.isSurvey
    ? dispatchProps.loadSurvey
    : dispatchProps.loadTemplate,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(QuestionBankContainer);
