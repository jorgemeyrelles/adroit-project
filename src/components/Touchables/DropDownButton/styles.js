import React from 'react';
import {
  Button, styled, Tooltip, css,
} from '@mui/material';

export const RedTooltip = styled(({ className, ...rest }) => (
  <Tooltip classes={{ tooltip: className, arrow: className }} {...rest} />
))(css`

background-color: #DD3E32;

  .MuiTooltip-arrow {
    color: #DD3E32;
    background-color: transparent !important;
  }
`);

export const Container = styled(Button)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 40px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
`;

export const LoadingWheel = styled('div')`
  position: absolute;
  display: flex;
  left: 8px;
`;
