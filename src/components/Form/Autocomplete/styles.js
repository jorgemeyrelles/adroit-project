import {
  styled, ButtonGroup, Autocomplete, Typography, css,
} from '@mui/material';

export const StyledAutocomplete = styled(Autocomplete)`
  /* min-width: 100px; */
`;

export const GroupedButtons = styled(ButtonGroup)`
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: #fff;

  .MuiButton-root {
    font-size: .8rem;
  }
`;

export const FarmNames = styled(Typography)`
  font-size: 12px; 
  font-weight: bold;
`;

export const OptionNames = styled(Typography)(() => css`
  margin: 2px 0;
  font-weight: bold;
  border-radius: 20px;
  white-space: nowrap;
  text-align: center;
  font-size: 14;
`);
