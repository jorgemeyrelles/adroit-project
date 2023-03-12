import {
  Button, styled, Typography, Box,
} from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  mediumgray: theme.palette.text.medium,
};

export const ButtonsArea = styled(Box)`
  width: 100%;
  height: 450px;
  padding: 0 3px;
  overflow-y: auto;
`;

export const Title = styled(Typography)`
  color: ${colors.primary};
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: left;
  cursor: default;

  ${theme.breakpoints.down('md')} {
    display: inline-block;
  }
`;

export const Subtitle = styled(Typography)`
  margin-bottom: 10px;
  color: ${colors.primary};
  font-size: 16px;
  font-weight: normal;
  text-align: left;
  cursor: default;
`;

export const Footer = styled('footer')`
  display: flex;
  justify-content: flex-end;
`;

export const ClearButton = styled(Button)`
  display: flex;
  border: 0;
  background: 0;
  font-size: 14px;
  letter-spacing: 0.03rem;
  text-transform: uppercase;
  color: ${colors.mediumgray};
  
  &:hover {
    color: ${colors.primary};
    cursor: pointer;
    background-color: transparent;
  }
`;
