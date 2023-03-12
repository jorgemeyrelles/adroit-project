import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@mui/material';
import { ButtonContainer } from './styles';

export function Button({ children, loading, ...props }) {
  return (
    <ButtonContainer
      disableRipple
      disableTouchRipple
      disableElevation
      {...props}
    >
      {loading
        ? <CircularProgress size={20} />
        : children}
    </ButtonContainer>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  loading: PropTypes.bool,
  props: PropTypes.node,
}.isRequired;
