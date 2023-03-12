import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@mui/material';
import { Container } from './styles';
import { theme } from '../../../pages/themes/default';

export function ChartButton(props) {
  const {
    children,
    loading,
    selected,
    disabled,
    onClick,
    valueKey,
    iconActive,
    icon,
  } = props;

  return (
    <Container
      sx={{
        color: selected ? '#fefefe' : '#2B4976',
        backgroundColor: selected ? '#2B4976' : '#fefefe',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.3 : 1,

        [theme.breakpoints.down('md')]: {
          borderColor: selected ? '#fefefe' : '#2B4976',
          backgroundColor: selected ? '#2B4976' : '#fefefe',
        },
      }}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      <div key={valueKey} style={{ position: 'relative' }}>
        <img
          style={{
            position: loading ? 'absolute' : 'relative',
            marginBottom: 8,
            opacity: loading ? 0 : 1,
          }}
          src={selected
            ? iconActive
            : icon}
          alt=""
        />
        {loading && <CircularProgress color="primary" />}
      </div>
      {children}
    </Container>
  );
}

ChartButton.propTypes = {
  props: PropTypes.node,
}.isRequired;
