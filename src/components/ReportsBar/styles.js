import {
  styled, Box, Button,
} from '@mui/material';

import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.paper,
  grey: theme.palette.text.light,
};

export const Container = styled('div')`
  justify-content: space-between;
  height: 65px;
  overflow-y: hidden;
  
  > div {
    gap: 1rem;
    display: flex;
  }
`;

export const AddReport = styled(Button)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 100px;
  height: 41px;
  text-transform: uppercase;
  border-width: 2px;
  border-style: solid;
  border-color: ${colors.primary};
  border-radius: 10px;
  color: ${colors.primary};
  
  p {
    font-size: 15px;
    color: ${colors.primary};
  }

  &:hover {
    color: ${colors.white};
    background-color: ${colors.primary};
    border: 2px solid ${colors.primary};
    
    > p {
      color: ${colors.white};
    }
  }
  
  ${theme.breakpoints.down('sm')} {
    min-width: 41px;
    padding: 9px;

    span {
      margin-left: 0;
    }

    p {
      display: none;
    }
  }
`;

export const ScrollableArea = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 6px;
  overflow: auto;
  padding-bottom: 0.5rem;

  button span {
    min-width: 100px;
  }
`;

export const ShowMoreButton = styled(Button)`
  display: flex;
  align-items: center;
  align-self: center !important;
  justify-content: center;
  background-color: transparent;
  min-width: 35px;
  height: 30px;
  border-radius: 99px;
  border: 2px solid ${colors.primary};
  
  transition: color .2s ease-in-out;
  color: ${colors.primary};
  cursor: pointer;
  
  &:hover  {
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;
