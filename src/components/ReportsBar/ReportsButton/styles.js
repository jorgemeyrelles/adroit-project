import React from 'react';
import {
  Button, ButtonGroup, css, lighten, Menu, styled, Tooltip,
} from '@mui/material';
import { theme } from '../../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.paper,
  grey: theme.palette.text.light,
};

export const ReportButtonGroup = styled(ButtonGroup)(({ selected }) => `
  height: 41px;
  max-width: 200px;

  button {
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    border-color: ${colors.primary};
    color: ${selected ? colors.white : colors.primary};
    background-color: ${selected ? colors.primary : colors.white};
    font-weight: ${selected ? 'bold' : 'regular'};

    &:disabled {
      color: ${lighten(colors.primary, 0.8)};
      border-width: 2px;
      border-style: solid;
      border-color: ${selected ? colors.white : colors.primary};
    }
  }

  &:hover > button {
    background-color: ${selected ? colors.primary : colors.white};
    border-width: 2px;
    border-style: solid;
    border-color: ${colors.primary};
    transition: font-weight .3s ease-in-out;
  }
`);

export const FarmDataTooltip = styled(({ className, ...rest }) => (
  <Tooltip classes={{ tooltip: className }} {...rest} />
))(css`
  width: 200px;
  margin-left: 25px;
  padding: 8px 12px;
  border-top: 0;
  border-radius: 10px;
  background-color: ${colors.primary};

  .MuiTooltip-arrow {
    color: ${colors.primary};
  }

  ${theme.breakpoints.down('md')} {
    display: none;
  }
`);

export const ReportNameButton = styled(Button)`
  width: 180px;
  border-right: unset !important;
  
  span {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const MenuButton = styled(Button)`
  position: relative;
  width: 30px !important;
  min-width: 30px !important;
  border-left: unset !important;
  margin-left: -5px !important;
`;

export const MenuPopup = styled(Menu)`
  ul {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0;

    span {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 6px;

      p {
        display: inline;
        padding: 0px 6px;
        background-color: ${colors.primary};
        color: ${colors.white};
        font-size: 12px;
        border-radius: 3px;
        text-transform: uppercase;
        cursor: default;
      }

      > button {
        width: 32px;
        min-width: 32px;
        min-height: 32px;
        margin-left: 6px;
        background-color: ${colors.white};
        border: 2px solid ${colors.primary};
        border-radius: 100%;
  
        svg {
          width: 22px;
          height: 22px;
        }
        
        &:hover {
          background-color: ${colors.primary};
          border: 2px solid ${colors.primary};
          color: ${colors.white};
        }
      }
    }

  }

  .MuiMenu-paper {
    background: none;
    box-shadow: none;
  }
`;

export const DeleteTooltip = styled(({ className, ...rest }) => (
  <Tooltip classes={{ tooltip: className }} {...rest} />
))(css`
  font-size: 14px;
  padding: 12px 4px;
  color: ${colors.background};
  border: 2px solid ${colors.white};
  background-color: ${colors.primary};
  border-radius: 10px;
  
  .MuiTooltip-arrow {
    margin-left: -0.99rem !important;
    height: 1rem !important;
    width: 1rem !important;
    
    &::before {
      font-size: 16px;
      border: 2px solid ${colors.white};
    }
    color: ${colors.primary};
  }

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;

    div {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      button {
        margin-top: 10px;
        border: transparent;

        &:hover {
          border: transparent
        }
      }
    }
  }
`);

export const OverFlowText = styled('div')`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 1rem;
`;
