import { styled, Box, Button } from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.paper,
  grey: theme.palette.text.light,
};

export const Container = styled('div')`
  position: absolute;
  right: 0;
  display: flex;
  flex-direction: column;
  z-index: 2;

  ${theme.breakpoints.down('md')} {
    position: unset;
    max-width: 100%;
    align-self: flex-end;
    margin-bottom: 20px;
  }
`;

export const ClearButton = styled(Box)`
  width: 50px;
  height: 41px;
  border: 2px solid ${colors.primary};
  text-align: center;
  border-right: 0;

  svg {
    color: ${colors.grey};
    vertical-align: -webkit-baseline-middle;
  }
`;

export const ClearButtonActive = styled(Box)`
  width: 54px;
  height: 2.6rem;
  border: 2px solid ${colors.primary};
  text-align: center;
  border-right: 0;
  cursor: pointer;

  svg {
    color: ${colors.primary};
    vertical-align: -webkit-baseline-middle;
  }
`;

export const FilterButton = styled(Button)`
  border: 2px solid ${colors.primary};

  &:disabled {
    border: 2px solid ${colors.grey};
  }
`;
