import React, {
  useRef, useContext,
} from 'react';
import PropTypes from 'prop-types';

import { Close } from '@mui/icons-material';
import { ClickAwayListener } from '@mui/material';
import { CloseMap, Container, Content } from './styles';
import { MapContext } from '../../context/MapContext';

export function DropDown({ children }) {
  const dropdownRef = useRef(null);
  const { slideIn, handleSlide } = useContext(MapContext);

  const handleClickAway = () => {
    if (slideIn) handleSlide(false);
  };

  return (
    <ClickAwayListener
      mouseEvent="onMouseUp"
      touchEvent="onTouchEnd"
      onClickAway={handleClickAway}
    >
      <Container>
        <Content
          ref={dropdownRef}
          style={{
            left: slideIn ? 0 : '-300px',
          }}
        >
          <CloseMap onClick={() => handleSlide(false)}>
            <Close />
          </CloseMap>
          {children}
        </Content>
      </Container>
    </ClickAwayListener>
  );
}

DropDown.propTypes = {
  children: PropTypes.node,
}.isRequired;
