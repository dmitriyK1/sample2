import { first, get, last, pick } from 'lodash';
import blockLabels from 'config/blockLabels';

const mapQuestionFromApiModel = (question, topics) => {
  const { configuration } = question.attributes;

  return {
    id: question.id,
    text: question.attributes.plain_text,
    type: blockLabels[question.attributes.type_],
    isFavorite: question.attributes.is_favorite,
    answerOptions: get(configuration, 'options', []).map(option =>
      pick(option, ['id', 'value']),
    ),
    labels: configuration.item_list
      ? [
          first(configuration.label_list_end),
          ...configuration.label_list_end_midpoint,
          last(configuration.label_list_end),
        ]
      : null,
    topics: get(question, 'relationships.topics.data')
      ? topics.filter(topic =>
          question.relationships.topics.data.find(
            relationship => relationship.id === topic.id,
          ),
        )
      : null,
  };
};

const mapTopicsFromApiModel = topics =>
  topics.map(data => ({
    id: data.id,
    name: data.attributes.name,
  }));

export const mapQuestionsFromApiModel = (questions, topics) => {
  return questions.map(question =>
    mapQuestionFromApiModel(question, mapTopicsFromApiModel(topics)),
  );
};

export const mapResponseFromApiModel = response => {
  return {
    questions: mapQuestionsFromApiModel(response.data, response.included),
    totalCount: response.meta.count,
  };
};
