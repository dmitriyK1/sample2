import { camelCase, mapKeys, find } from 'lodash';

import { mapQuestionsFromApiModel } from './questionsDataMapper';

export const QUESTION_TYPE = 'survey_question';
export const TOPIC_TYPE = 'survey_question_topic';

const mapUsageDataToQuestions = (usageData, questions) => {
  return usageData.map(usageData =>
    find(questions, { id: usageData.questionId }),
  );
};

const normalizeQuestionUsageData = usageData => ({
  ...mapKeys(usageData.attributes, (value, key) => camelCase(key)),
  questionId: usageData.relationships.questions.data.id,
});

export const mapResponseFromApiModel = response => {
  const topics = response.included.filter(item => item.type === TOPIC_TYPE);

  const questions = response.included.filter(
    item => item.type === QUESTION_TYPE,
  );

  const questionsSortedByUsageDate = mapUsageDataToQuestions(
    response.data.map(normalizeQuestionUsageData),
    questions,
  );

  return {
    questions: mapQuestionsFromApiModel(questionsSortedByUsageDate, topics),
    totalCount: response.meta.count,
  };
};
