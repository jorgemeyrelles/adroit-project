import { Box, Button, styled } from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.default,
  darkgray: theme.palette.text.main,
};

export const Container = styled('article')`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background-color: ${colors.white};

  border: 2px solid ${colors.primary};
  border-radius: 10px;
  overflow: hidden;

  transition: all 150ms ease-in-out;

  ${theme.breakpoints.down('md')} {
    width: 100%;
    min-height: 100%;
  }
`;

export const ChartHeader = styled('header')`
  display: flex;
  justify-content: space-between;
  width: 90%;

  & > p {
    color: ${colors.primary};
    display: flex;
    flex-direction: column;
  }

  & span {
    color: ${colors.primary};
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  ${theme.breakpoints.down('md')} {
    &:first-of-type {
      margin-top: 2rem;
    }
  }
  
  ${theme.breakpoints.only('sm')} {
    &:first-of-type {
      margin-top: 0;
    }
  }
`;

export const Period = styled(Box)`
  display: flex;
  flex-direction: column;

  & > p {
    color: ${colors.primary};
    text-align: right;
    font-size: 12px;
    white-space: nowrap;
  }
`;

export const CloseButton = styled(Button)`
  position: absolute;
  top: -5px;
  right: -10px;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  margin-right: 5px;

  &:hover {
    background-color: ${colors.primary};
    & svg {
      fill: ${colors.white};
    }
  }
`;

export const AdjustSize = styled(Box)`
  margin-top: 30px;
  text-transform: uppercase;
  font-size: 14px;
  
  button {
    min-width: 20px;
    
    &:first-of-type {
      margin-left: 8px;
    }
  }

  ${theme.breakpoints.down('md')} {
    display: none;
  }
`;
