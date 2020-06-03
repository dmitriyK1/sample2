import { memoize } from 'lodash';

export const getTagDropdownOptions = memoize(categories => {
  return categories.map(category => ({
    value: category.name,
    label: category.name,
  }));
});
