import axios from 'axios';
import { buildApiV2Url } from '../../../api/utils/apiUtils';
import { generateApiError } from '../../../api/utils/apiErrorMessages';

export const favoriteQuestion = (id, isFavorite) =>
  axios
    .patch(buildApiV2Url(`questions/${id}`), {
      is_favorite: isFavorite,
    })
    .catch(generateApiError());
