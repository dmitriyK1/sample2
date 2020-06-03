import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import { Badge } from '@libs/engagement-ui';
import Masonry from 'react-masonry-component';
import {
  Button,
  DropdownButton,
  InfiniteScroll,
  SpinnerSvg,
} from '@libs/next-ui';

import { QuestionTiles } from '../QuestionTiles';
import { SearchInput } from '../SearchInput';
import { masonryOptions } from '../../config';
import { getTagDropdownOptions } from '../../utils/getTagDropdownOptions';
import { makeDebounced } from '../../utils/makeDebounced';
import styles from '../../styles/common.scss';
import { createSurveysListPathFromModal } from '../../utils/createModalPath';
import * as tracking from '../../../../tracking';
import {
  getTagsFromUrlParams,
  stringifyTags,
} from '../../utils/questionBankUrlUtils';
import { toggleItem } from '../../utils/toggleItem';

export class Tab extends React.Component {
  static propTypes = {
    isInsideModal: PropTypes.bool,
    offset: PropTypes.number,
    totalCount: PropTypes.number,
    entityId: PropTypes.string,
    activeEntityUrl: PropTypes.string,
    categories: PropTypes.array,
    questions: PropTypes.array,
    selectedQuestionIds: PropTypes.arrayOf(PropTypes.string),
    navigateToUrl: PropTypes.func.isRequired,
    addQuestions: PropTypes.func.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onTagsChange: PropTypes.func.isRequired,
    selectQuestion: PropTypes.func.isRequired,
    getCategories: PropTypes.func.isRequired,
    getQuestions: PropTypes.func.isRequired,
    toggleFavorite: PropTypes.func.isRequired,
  };

  state = {
    search: '',
    selectedDropdownTag: null,
    selectedTags: getTagsFromUrlParams(),
  };

  componentDidMount() {
    this.props.getCategories();
  }

  addQuestions = () => {
    this.setState({ selectedQuestionIds: [] });

    tracking.emitTrackingEvent(
      tracking.QUESTION_BANK,
      'Create',
      this.props.selectedQuestionIds,
    );

    this.props.addQuestions(
      this.props.entityId,
      this.props.selectedQuestionIds,
    );
  };

  handleQuestionClick = questionId => {
    this.props.selectQuestion(questionId);
  };

  handleFavoriteClick = (questionId, isFavorite) => {
    this.props.toggleFavorite(questionId, !isFavorite);
  };

  handleTagClick = (ev, tag) => {
    ev.stopPropagation();

    const selectedTags = toggleItem(tag, this.state.selectedTags);

    this.props.navigateToUrl({ search: stringifyTags(selectedTags) });

    this.setState({ selectedTags });
    this.getQuestionsByTag(selectedTags);
  };

  handleTagDropdownChange = option => {
    const selectedTags = toggleItem(option.value, this.state.selectedTags);

    this.props.navigateToUrl({ search: stringifyTags(selectedTags) });

    this.setState({
      selectedDropdownTag: option.value,
      selectedTags,
    });

    this.getQuestionsByTag(selectedTags);
  };

  renderBadge() {
    const selectedQuestionsCount = this.props.selectedQuestionIds.length;

    if (selectedQuestionsCount < 2) {
      return null;
    }

    return (
      <Badge e2e="selected-questions-badge" className={styles.badge}>
        {selectedQuestionsCount}
      </Badge>
    );
  }

  /* gets questions that belong to a selected category */
  getQuestionsByTag = makeDebounced(selectedTags => {
    this.props.onTagsChange({
      selectedTags,
      search: this.state.search,
    });
  });

  handleSearchChange = search => {
    this.setState({ search });
    this.onSearchChange(search);
  };

  onSearchChange = makeDebounced(
    search => {
      this.props.onSearchChange({
        search,
        selectedTags: this.state.selectedTags,
        offset: this.props.offset,
      });
    },
    { leading: false },
  );

  /* debounce to prevent loading same questions on initial load */
  loadMore = makeDebounced(() => {
    this.props.getQuestions({
      selectedTags: this.state.selectedTags,
      search: this.state.search,
      offset: this.props.offset,
    });
  });

  render() {
    return (
      <React.Fragment>
        <div className={styles.tilesListHeader}>
          <DropdownButton
            data-e2e="question-categories"
            className={styles.categoriesSelect}
            value={this.state.selectedDropdownTag}
            options={getTagDropdownOptions(this.props.categories)}
            onChange={this.handleTagDropdownChange}
          >
            Category
          </DropdownButton>
          <ul className={styles.primaryTagsList}>
            {this.state.selectedTags &&
              this.state.selectedTags.map(tag => (
                <li data-e2e="category-tag" className={styles.tag} key={tag}>
                  <b>Category </b>
                  {tag}
                  <span
                    onClick={ev => this.handleTagClick(ev, tag)}
                    className={styles.tagCloseButton}
                  >
                    &times;
                  </span>
                </li>
              ))}
          </ul>
          <SearchInput
            onChange={this.handleSearchChange}
            className={cx(styles.searchInput, styles.up)}
            placeholder="Search questions"
          />
        </div>
        <div className={styles.infiniteScrollContainer}>
          <InfiniteScroll
            className={styles.infiniteScroll}
            threshold={100}
            hasMore={this.props.questions.length < this.props.totalCount}
            loadMore={this.loadMore}
            spinner={
              <SpinnerSvg className={styles.spinner} size={16} thickness={2} />
            }
          >
            <Masonry options={masonryOptions}>
              <QuestionTiles
                questions={this.props.questions}
                selectedQuestionIds={this.props.selectedQuestionIds}
                selectedTags={this.state.selectedTags}
                search={this.state.search}
                addQuestions={this.addQuestions}
                handleTagClick={this.handleTagClick}
                handleQuestionClick={this.handleQuestionClick}
                handleFavoriteClick={this.handleFavoriteClick}
              />
            </Masonry>
          </InfiniteScroll>
        </div>
        <div className={styles.buttons}>
          <Link
            to={createSurveysListPathFromModal({
              goBackUrl: this.props.activeEntityUrl,
              openInModal: this.props.isInsideModal,
            })}
          >
            <Button data-e2e="cancel-btn">Close</Button>
          </Link>
          <Button
            data-e2e="add-multiple-questions-btn"
            onClick={this.addQuestions}
            className={cx(styles.addButton, styles.up)}
            kind={
              isEmpty(this.props.selectedQuestionIds) ? 'default' : 'success'
            }
            disabled={isEmpty(this.props.selectedQuestionIds)}
          >
            Add
            {this.renderBadge()}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
