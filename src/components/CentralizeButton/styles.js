import { styled } from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.default,
};

export const Centralize = styled('button')`
  position: absolute;
  top: 10px;
  right: 10px;

  display: grid;
  place-items: center;

  width: 38px;
  height: 38px;

  background-color: ${colors.white};
  border-radius: 50%;
  border: 0;
  cursor: pointer;

  svg {
    color: ${colors.primary};
  }
`;
