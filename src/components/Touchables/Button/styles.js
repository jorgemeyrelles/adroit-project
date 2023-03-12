import { styled, Button } from '@mui/material';

export const ButtonContainer = styled(Button)`
  &:disabled {
    color: rgba(0, 0, 0, 0.38);
    background-color: 'rgba(0, 0, 0, 0.12)';
  }
`;
