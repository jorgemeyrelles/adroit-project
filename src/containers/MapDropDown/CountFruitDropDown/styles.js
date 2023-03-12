import { Box, Button, styled } from '@mui/material';
import { theme } from '../../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.default,
};

export const ContainerButton = styled(Button)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 40px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 10px;
  border: 2px solid ${colors.primary};
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    background-color: transparent;
  }
`;

export const Content = styled(Box)`
  padding: 16px;
`;
