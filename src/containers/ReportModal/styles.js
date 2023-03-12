import { Box, styled } from '@mui/material';
import { Button } from '../../components/Touchables/Button';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.default,
  darkgrey: theme.palette.text.main,
  lightgrey: theme.palette.text.light,
};

export const ReportDataBox = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const InputContainer = styled(Box)`
  > div {
    > div {
      width: 100%;
      display: grid;
      grid-template-columns: auto 5%;
      align-items: center;
      gap: 10px;

      ${theme.breakpoints.down('md')} {
        grid-template-columns: unset;
      }
    }
  }
  
  ${theme.breakpoints.down('md')} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Content = styled(Box)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  grid-gap: 10px;

  ${theme.breakpoints.down('md')} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const ButtonFilter = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  width: 50px;
  min-width: 35px;
  height: 30px;
  border-radius: 99px;
  border: 1px solid ${colors.lightgrey};
  
  transition: color .2s ease-in-out;
  color: ${colors.lightgrey};
  cursor: pointer;
  
  &:hover  {
    border: 1px solid ${colors.darkgrey};
    background-color: transparent;
    color: ${colors.darkgrey};
  }

  ${theme.breakpoints.down('md')} {
    display: none;
  }
`;

export const CopyForm = styled(Box)`
  display: flex;
  margin-top: 20px;

  justify-items: end;

  ${theme.breakpoints.down('md')} {
    margin-top: 30px;
  }
`;
