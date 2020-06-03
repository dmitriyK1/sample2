import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { TabPanel } from '@libs/next-ui';
import { ListTabs } from '@libs/engagement-ui';

import withFullScreenModalHandlers from '../../../fullScreenModal/hoc/withFullScreenModalHandlers';
import FullPageModal from '../../../common/components/FullPageModal';
import styles from '../../styles/common.scss';
import { getBankUrl } from '../../utils/questionBankUrlUtils';
import { tabTypes } from '../../config';
import { AllQuestionsTab } from '../../containers/AllQuestionsTab';
import { RecentQuestionsTab } from '../../containers/RecentQuestionsTab';
import { FavoriteQuestionsTab } from '../../containers/FavoriteQuestionsTab';

class QuestionBank extends PureComponent {
  static propTypes = {
    /* props from `withFullScreenModalHandlers` HOC */
    isInsideModal: PropTypes.bool,

    /* props from container */
    activeEntityUrl: PropTypes.string,
    tabName: PropTypes.string,
    navigateToUrl: PropTypes.func.isRequired,
    loadEntity: PropTypes.func.isRequired,
    onTabChange: PropTypes.func.isRequired,
    resetState: PropTypes.func.isRequired,
  };

  static defaultProps = {
    isInsideModal: false,
  };

  static tabNames = ['All questions', 'Favorites', 'Recently used'];
  static tabSlugsList = [tabTypes.ALL, tabTypes.FAVORITES, tabTypes.RECENT];

  static getTitleComponent() {
    return (
      <Fragment>
        <div>Question bank</div>
        <div className={styles.description}>
          Select question you would like to include in your survey
        </div>
      </Fragment>
    );
  }

  state = {
    activeTabIndex: 0,
  };

  componentWillUnmount() {
    this.props.resetState();
  }

  componentDidMount() {
    const activeTabIndex = QuestionBank.tabSlugsList.indexOf(
      this.props.tabName,
    );

    const isValidTabName = activeTabIndex !== -1;

    if (!isValidTabName) {
      this.props.navigateToUrl(getBankUrl(this.props.activeEntityUrl));

      return;
    }

    this.setState({ activeTabIndex });
  }

  goBack = () => this.props.navigateToUrl(this.props.activeEntityUrl);

  handleTabChange = selectedTabIndex => {
    this.setState({
      activeTabIndex: selectedTabIndex,
    });

    this.props.onTabChange(QuestionBank.tabSlugsList[selectedTabIndex]);

    this.props.navigateToUrl(
      `${getBankUrl(this.props.activeEntityUrl)}/${
        QuestionBank.tabSlugsList[selectedTabIndex]
      }${window.location.search}`,
    );
  };

  render() {
    return (
      <FullPageModal
        title={QuestionBank.getTitleComponent()}
        contentClassName={styles.modalContent}
        headerClassName={styles.modalHeader}
        isInsideModal={this.props.isInsideModal}
        {...this.props}
        onClose={this.goBack}
        e2e="question-bank-modal"
      >
        <ListTabs
          tabListClassName={cx(styles.listTabs, styles.up)}
          handleTabChange={this.handleTabChange}
          tabs={QuestionBank.tabNames}
          selectedIndex={this.state.activeTabIndex}
        >
          <TabPanel className={cx(styles.tabPanel, styles.up)}>
            <AllQuestionsTab
              activeEntityUrl={this.props.activeEntityUrl}
              loadEntity={this.props.loadEntity}
            />
          </TabPanel>
          <TabPanel className={cx(styles.tabPanel, styles.up)}>
            <FavoriteQuestionsTab
              activeEntityUrl={this.props.activeEntityUrl}
              loadEntity={this.props.loadEntity}
            />
          </TabPanel>
          <TabPanel className={cx(styles.tabPanel, styles.up)}>
            <RecentQuestionsTab
              activeEntityUrl={this.props.activeEntityUrl}
              loadEntity={this.props.loadEntity}
            />
          </TabPanel>
        </ListTabs>
      </FullPageModal>
    );
  }
}

export default withFullScreenModalHandlers(QuestionBank);
