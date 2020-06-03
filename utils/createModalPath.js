import { questionBank } from '../../../routes/paths';
import { QUESTION_BANK_SLUG } from '../config';

const createModalPath = ({ openInModal = true, path = questionBank } = {}) => ({
  pathname: path,
  state: { modal: Boolean(openInModal) },
});

export const createSurveysListPathFromModal = ({
  openInModal = true,
  goBackUrl,
} = {}) => createModalPath({ openInModal, path: goBackUrl });

export const createQuestionBankLocation = currentPath => ({
  state: { modal: true },
  pathname: currentPath
    .replace(/\/$/, '')
    .replace(`/${QUESTION_BANK_SLUG}`, ''),
});
