import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import SidebarButton from 'components/sidebar/editorSidebar/SidebarButton/SidebarButton';
import icon from './questionbank.svg';
import styles from './surveyQuestionsSidebar.scss';
import { getBankUrl } from '../../utils/questionBankUrlUtils';
import { shouldRestrictAddBlockToSurvey } from '../../../../reducers';
import * as tracking from '../../../../tracking';

const triggerTrackingEvent = () =>
  tracking.emitTrackingEvent(tracking.QUESTION_BANK, 'Open');

const QuestionBankButton = props => (
  <Link
    className={cx(styles.questionBankLink, {
      [styles.questionBankButtonDisabled]: props.readOnly,
    })}
    to={{
      pathname: getBankUrl(props.location.pathname),
      state: { modal: true },
    }}
  >
    <SidebarButton
      readOnly={props.readOnly}
      fullWidth
      e2e="question-bank-button"
      className={styles.questionBankButton}
      label="Question bank"
      icon={
        <img
          className={cx(styles.questionBankIcon, {
            [styles.questionBankIconDisabled]: props.readOnly,
          })}
          src={icon}
          alt="question-bank-icon"
        />
      }
      onClick={triggerTrackingEvent}
    />
  </Link>
);

QuestionBankButton.propTypes = {
  readOnly: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = state => {
  const isAddBlockDisabled = shouldRestrictAddBlockToSurvey(state);

  return {
    readOnly: isAddBlockDisabled,
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps),
)(QuestionBankButton);
