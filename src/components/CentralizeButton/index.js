import React from 'react';
import PropTypes from 'prop-types';
import { FilterCenterFocus } from '@mui/icons-material';
import { Centralize } from './styles';

export function CentralizeButton(props) {
  const { setClickCenter } = props;

  return (
    <Centralize
      title="centralizar"
      onClick={() => setClickCenter((click) => !click)}
    >
      <FilterCenterFocus />
    </Centralize>
  );
}

CentralizeButton.propTypes = {
  children: PropTypes.node,
}.isRequired;
