import {
  Box, Button, styled, alpha,
} from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  background: theme.palette.background.default,
};

export const Wrapper = styled(Box)`
  position: absolute;
  width: 280px;
  z-index: 1;
`;

export const SummaryButton = styled(Button)`
  position: relative;

  display: flex;
  justify-content: space-between;
  align-items: center;

  max-width: 400px;
  height: 41px;
  margin: 0 auto;

  color: ${({ open }) => (open ? colors.background : colors.primary)} !important;
  background-color: ${({ open }) => (open ? colors.primary : colors.background)} !important;

  border-radius: ${({ open }) => (open ? '10px 10px 0 0' : '10px')};
  border-width: 2px !important;
  border-style: solid;
  border-color: ${colors.primary};
  border-bottom-width: ${({ open }) => (open ? '0' : '2px')};

  transition: border-radius 300ms ease-in-out;
  z-index: 1;
  
  p {
    display: flex;
    margin: ${({ open }) => (open ? 0 : '0 auto')};

    font-size: 18px;
    font-weight: bold;

    color: ${({ open }) => (open ? colors.background : colors.primary)};
    transition: margin 200ms ease-in-out;
  }

  ${theme.breakpoints.up('md')} {
    display: none;
  }
`;

export const Divider = styled(Box)`
  display: flex;
  align-self: center;
  
  height: 2px;
  width: 80%;

  margin-bottom: 12px;
  background-color: ${alpha(colors.background, 0.2)};
`;

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;

  margin: 0 auto;
  padding: 8px 16px;
  background-color: ${colors.primary};
  border-radius: 0 0 10px 10px;

  p {
    margin-bottom: 6px;
    font-weight: bold;
    color: ${colors.background};

    span {
      font-weight: 400;
    }
  }
  
  ${theme.breakpoints.up('md')} {
    display: none;
  }
`;
