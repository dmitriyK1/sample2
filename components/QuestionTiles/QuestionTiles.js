import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import cx from 'classnames';
import { Button } from '@libs/next-ui';
import Highlighter from 'react-highlight-words';

import styles from './QuestionTiles.scss';

const TileHeader = props => {
  const favoriteIconClassName = cx(
    styles.favoriteIcon,
    props.isFavorite ? 'icon-custom-star-fill' : 'icon-custom-star',
  );

  return (
    <header className={styles.tileHeader} role="group">
      <p data-e2e="question-title" className={styles.questionText}>
        {props.search ? (
          <Highlighter
            highlightClassName={styles.highlight}
            textToHighlight={props.questionText}
            searchWords={[props.search]}
          />
        ) : (
          props.questionText
        )}
      </p>
      <span
        role="button"
        tabIndex="0"
        data-e2e={cx('tile-favorite-button', {
          'tile-favorite-button-selected': props.isFavorite,
        })}
        className={favoriteIconClassName}
        onClick={ev => {
          ev.stopPropagation();
          props.handleFavoriteClick(props.questionId, props.isFavorite);
        }}
      />
    </header>
  );
};

TileHeader.propTypes = {
  isFavorite: PropTypes.bool,
  questionId: PropTypes.string,
  search: PropTypes.string,
  questionText: PropTypes.string,
  handleFavoriteClick: PropTypes.func.isRequired,
};

const renderTopics = (topics, selectedTags, handleTagClick) => {
  if (!topics) return;

  return (
    <ul className={styles.tagsList}>
      {topics.map(topic => (
        <li
          data-e2e="question-category-tag"
          key={topic.id}
          className={cx(styles.tag, {
            [styles.tagSelected]: selectedTags.includes(topic.name),
          })}
          onClick={ev => handleTagClick(ev, topic.name)}
        >
          {topic.name}
        </li>
      ))}
    </ul>
  );
};

const QuestionTiles = React.memo(props => {
  const [isAddButtonVisible, setAddButtonVisible] = useState(false);

  return props.questions.map(question => {
    const isSelected = props.selectedQuestionIds.includes(question.id);

    return (
      <div
        onMouseOver={() => setAddButtonVisible(true)}
        onMouseOut={() => setAddButtonVisible(false)}
        data-e2e={cx('question-tile', {
          'question-tile-selected': isSelected,
        })}
        className={cx(styles.questionItem, {
          [styles.questionItemSelected]: isSelected,
        })}
        onClick={() => props.handleQuestionClick(question.id)}
        key={question.id}
      >
        <TileHeader
          isFavorite={question.isFavorite}
          questionId={question.id}
          questionText={question.text}
          search={props.search}
          handleFavoriteClick={props.handleFavoriteClick}
        />
        <Button
          data-e2e="add-question-btn"
          onClick={props.addQuestions}
          className={cx(styles.up, styles.addSingleQuestionBtn, {
            [styles.addSingleQuestionBtnVisible]:
              isSelected &&
              isAddButtonVisible &&
              props.selectedQuestionIds.length === 1,
          })}
          disabled={isEmpty(props.selectedQuestionIds)}
          kind="primary"
        >
          Add
        </Button>
        <div className={styles.questionBody}>
          <h4 className={styles.questionHeading}>{question.type}</h4>
          {question.labels && (
            <Fragment>
              <div className={styles.scaleValue}>
                0-{question.labels.length}
              </div>
              <h4 className={styles.questionHeading}>Labels</h4>
              <ul>
                {question.labels.map(
                  label =>
                    label.value ? (
                      <li className={styles.scaleLabel} key={label.id}>
                        {label.value}
                      </li>
                    ) : null,
                )}
              </ul>
            </Fragment>
          )}
          <ul>
            {question.answerOptions.map(
              answer =>
                answer.value ? (
                  <li className={styles.answerOption} key={answer.id}>
                    {answer.value}
                  </li>
                ) : null,
            )}
          </ul>
          {renderTopics(
            question.topics,
            props.selectedTags,
            props.handleTagClick,
          )}
        </div>
      </div>
    );
  });
});

QuestionTiles.propTypes = {
  questions: PropTypes.array,
  selectedQuestionIds: PropTypes.array,
  selectedTags: PropTypes.array,
  search: PropTypes.string,
  addQuestions: PropTypes.func.isRequired,
  handleTagClick: PropTypes.func.isRequired,
  handleQuestionClick: PropTypes.func.isRequired,
  handleFavoriteClick: PropTypes.func.isRequired,
};

export { QuestionTiles };
