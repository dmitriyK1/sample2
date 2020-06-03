import { debounce } from 'lodash';
import { DEFAULT_DEBOUNCE_TIME } from 'sharedParts';

export const makeDebounced = (
  fn,
  { timeout = DEFAULT_DEBOUNCE_TIME, leading = true } = {},
) => {
  return debounce(fn, timeout, { leading });
};
