import axios from 'axios';

import { buildApiV2Url, jsonApiHeaders } from '../../../api/utils/apiUtils';
import { generateApiError } from '../../../api/utils/apiErrorMessages';

export const postQuestions = ({ entityId, selectedQuestionIds }) =>
  axios
    .post(
      buildApiV2Url(`/surveys/${entityId}/questions/load`),
      {
        question_ids: selectedQuestionIds,
      },
      {
        headers: jsonApiHeaders,
      },
    )
    .catch(generateApiError());
