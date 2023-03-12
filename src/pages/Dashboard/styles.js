import { styled, Box, Typography } from '@mui/material';

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;
  height: 100%;

  margin-top: 40px;

  h3 {
    font-weight: 500;
    text-transform: uppercase;
    color: #4a4a4a;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;

    max-width: 250px;

    margin-top: 44px;
    
    img {
      width: 100px;
      height: 102px;
    }
  }
`;

export const Description = styled(Typography)`
  margin-top: 44px;
  margin-bottom: 36px;
  font-weight: bold;
  text-align: center;
`;
