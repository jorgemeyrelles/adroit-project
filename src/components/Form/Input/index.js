import React, { useRef } from 'react';
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';

export function Input({ variant, name, ...rest }) {
  const inputRef = useRef(null);

  return (
    <TextField
      inputRef={inputRef}
      name={name}
      {...rest}
    />
  );
}

Input.propTypes = {
  name: PropTypes.string,
  rest: PropTypes.node,
}.isRequired;
