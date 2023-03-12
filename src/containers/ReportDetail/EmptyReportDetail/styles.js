import { styled, Typography } from '@mui/material';

export const ContentEmpty = styled('section')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 4rem;

  img {
    width: 100px;
    height: 100px;
  }
`;

export const Description = styled(Typography)`
  margin-top: 44px;
  margin-bottom: 36px;
  font-weight: bold;
  text-align: center;
  max-width: 300px;
  color: #4a4a4a;
`;
