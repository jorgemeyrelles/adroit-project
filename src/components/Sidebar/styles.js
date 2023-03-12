import { styled } from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.default,
};

export const Container = styled('nav')`
  width: 105px;
  padding: 10px 0;
  border: 2px solid ${colors.primary};
  border-radius: 10px;
  background-color: ${colors.white};
  text-align: -webkit-center;

  ${theme.breakpoints.down('md')} {
    display: flex;
    width: 100vw;
    padding: 5px;
    gap: 6px;
    border: 0;
    border-top: 2px solid ${colors.primary};
    border-bottom: 2px solid ${colors.primary};
    border-radius: 0;
    overflow-x: auto; 

    div {
      height: 100%;
    }
  }
`;
