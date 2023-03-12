import React from 'react';
import {
  Button,
  css, FormGroup, styled, Tooltip,
} from '@mui/material';

import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.paper,
  grey: theme.palette.text.light,
};

export const FormControlTooltip = styled(({ className, ...rest }) => (
  <Tooltip classes={{ tooltip: className }} {...rest} />
))(css`
    font-size: 12px;
    margin-top: 3px;
    max-width: 390px;
    position: relative;
    top: -10px;

    color: ${colors.white};
    background-color: ${colors.primary};
    border: 2px solid ${colors.white};
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px 0px;
    border-radius: 10px;

    .MuiTooltip-arrow {
      &:before {
        border: 2px solid ${colors.white};
      };
      font-size: 20px;
      color: ${colors.primary};
    }
  `);

export const FormGroupContainer = styled(FormGroup)`
    max-height: 300px;
    overflow: auto;
    overflow-x: hidden;
    color: ${colors.white};

    .MuiFormControlLabel-root {
      color: ${colors.white};
      min-width: 20px;
    }
  `;

export const FormButton = styled(Button)`
  height: 41px;
  color: ${colors.primary};

  border-color: ${colors.primary};
  border: 2px solid ${colors.primary};
  border-right: 0;

  cursor: default;
  
  &:hover {
    color: ${colors.white};
    background-color: ${colors.primary};

    border: 2px solid ${colors.primary};
    border-right: 0;
  }
`;
