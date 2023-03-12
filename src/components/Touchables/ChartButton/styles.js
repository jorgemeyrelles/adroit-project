import { styled } from '@mui/material';
import { theme } from '../../../pages/themes/default';

export const Container = styled('button')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 85px;
  min-height: 85px;
  margin-bottom: 10px;
  padding: 10px 0;
  border: 0;
  border-radius: 10px;
  text-align: center;
  text-decoration: none;

  ${theme.breakpoints.down('md')} {
    width: 80px;
    height: 80px;
    margin-bottom: 0;
    padding: 10px;
    
    border-width: 2px;
    border-style: solid;
    border-radius: 10px;
    
    font-size: 12px;
    font-weight: bold;

    div {
      img {
        max-height: 32px;
      }
    }
  }
`;
