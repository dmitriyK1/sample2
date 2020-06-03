import axios from 'axios';

import { buildApiV2Url, jsonApiHeaders } from '../../../api/utils/apiUtils';
import { generateApiError } from '../../../api/utils/apiErrorMessages';
import { mapResponseFromApiModel } from './categoriesDataMapper';

export const getCategories = () => {
  return axios
    .get(buildApiV2Url('question-topics'), {
      headers: jsonApiHeaders,
    })
    .catch(generateApiError())
    .then(({ data }) => data)
    .then(mapResponseFromApiModel);
};
