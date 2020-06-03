import { uniq, without } from 'lodash';

export const toggleItem = (item, allItems) => {
  return allItems.includes(item)
    ? without(allItems, item)
    : uniq([...allItems, item]);
};
