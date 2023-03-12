import {
  styled, Dialog, DialogActions, Button, DialogContent, IconButton, Box,
} from '@mui/material';

import { theme } from '../../pages/themes/default';

export const Container = styled(Dialog)`
  padding: 15px;
  
  ${theme.breakpoints.down('md')} {
    .MuiBackdrop-root {
      background-color: transparent;
    }
    
    .MuiModal-root {
      background-color: transparent;
    }
  }
  
  
  .MuiPaper-root {
    padding-top: 20px;

    ${theme.breakpoints.down('md')} {
      position: absolute;
      top: 60px;
      min-width: 100vw;
      box-shadow: none;
    }
  }
`;

export const Header = styled(Box)`
  padding: 0 24px;
  color: ${theme.palette.text.main};

  h2 {
    font-size: 24px;
  }
`;

export const CloseButton = styled(IconButton)`
  margin-right: 24px;
  padding: 0;
  align-self: flex-end;

  font-weight: bold;
  font-family: 'Mukta';

  div {
    display: none;
    margin-bottom: 12px;
    font-size: 14px;
    text-transform: uppercase;

    ${theme.breakpoints.down('md')} {
      display: flex;
      justify-content: center;
      align-items: center;
    };

    span {
      font-size: 14px;
      font-weight: 500;
    }
  }

  
  ${theme.breakpoints.down('md')} {
    align-self: flex-start;
  }
`;

export const InputContainer = styled(DialogContent)`
  display: grid;
  gap: 20px;

  ${theme.breakpoints.down('md')} {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
`;

export const Footer = styled(DialogActions)`
  padding: 8px 24px 24px;
  display: flex;
  gap: 16px;
`;

export const SubmitButton = styled(Button)`
  transition: width ease 2s;
  width: 106px;
  height: 40px;
`;
