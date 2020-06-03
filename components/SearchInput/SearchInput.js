import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SearchField } from '@libs/next-ui';

const ENTER_KEY_CODE = 13;

const handleKeyDown = ev => {
  if (ev.keyCode === ENTER_KEY_CODE) {
    ev.target.blur();
  }
};

const SearchInput = props => {
  const [searchValue, onSearchChange] = useState('');

  const handleOnChange = ev => {
    const value = ev ? ev.target.value : '';

    onSearchChange(value);
    props.onChange(value);
  };

  return (
    <SearchField
      data-e2e="search-questions-input"
      containerClassName={props.className}
      placeholder={props.placeholder}
      value={searchValue}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
    />
  );
};

SearchInput.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export { SearchInput };
