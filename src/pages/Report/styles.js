import { styled, Box } from '@mui/material';
import { theme } from '../themes/default';

export const Container = styled(Box)`
  position: relative;
  
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;
  
  ${theme.breakpoints.down('md')} {
    margin-top: 0px;
  }
`;

export const MobileContainer = styled(Box)`
  display: none;
  width: 100vw;
  height: 110px;

  ${theme.breakpoints.down('md')} {
    display: flex;
  }
`;
