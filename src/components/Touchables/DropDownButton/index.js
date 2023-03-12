import React from 'react';
import PropTypes from 'prop-types';

import { CircularProgress, Zoom } from '@mui/material';
import { Container, LoadingWheel, RedTooltip } from './styles';

export function DropDownButton(props) {
  const {
    children,
    loading,
    selected,
    disabled,
    onClick,
    selectedMap,
  } = props;
  return (
    <RedTooltip
      title={selectedMap && !loading && disabled ? 'Não existem dados para este período' : ''}
      TransitionComponent={Zoom}
      placement="right"
      arrow
    >
      <span style={{ display: 'flex' }}>
        <Container
          type="button"
          onClick={onClick}
          disabled={disabled}
          style={{
            border: selected ? '2px solid #2B4976' : '2px solid #2B4976',
            color: selected ? '#fefefe' : '#2B4976',
            backgroundColor: selected ? '#2B4976' : '#fefefe',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.3 : 1,
            pointerEvents: disabled ? 'none' : 'auto',
          }}
        >
          <LoadingWheel>
            {loading && <CircularProgress color="primary" size={20} />}
          </LoadingWheel>

          {children}
        </Container>

      </span>
    </RedTooltip>
  );
}

DropDownButton.propTypes = {
  props: PropTypes.node,
}.isRequired;
