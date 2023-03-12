import { Box, ButtonBase, styled } from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.default,
};

export const Container = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CloseMap = styled(ButtonBase)`
  display: none;

  ${theme.breakpoints.down('md')} {
    display: flex;
    justify-content: center;
    align-items: center;

    position: absolute;
    right: 20px;
    top: 10px;

    background-color: ${colors.primary};
    color: ${colors.white};
    border-radius: 6px;
  }
`;

export const Content = styled('div')`
  z-index: 2;
  position: absolute;
  top: 0;
  left: -300px;
  width: 290px;
  max-height: 600px;
  padding: 20px;
  background-color: ${colors.white};
  border: 2px solid ${colors.primary};
  border-radius: 10px ;
  transition: all 0.3s ease;
  
  ${theme.breakpoints.down('md')} {
    border-radius: 0px ;
  }
`;
