import { Box, styled } from '@mui/material';
import { theme } from '../../pages/themes/default';

export const Container = styled(Box)`
  display: grid;
  grid-template-columns: 105px 1fr;
  
  width: 100%;
  
  ${theme.breakpoints.down('md')} {
    grid-template-columns: 1fr;
    margin-top: 1rem;
  }
  `;

export const DesktopContainer = styled(Box)`
  ${theme.breakpoints.down('md')} {
    display: none;
  }
  `;

export const Content = styled('section')`
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;

  margin-left: 1.25rem;
  margin-bottom: 2.25rem;
  margin-top: 1.25rem;
  gap: 16px;

  ${theme.breakpoints.down('md')} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  ${theme.breakpoints.only('sm')} {
    margin-top: 2rem;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const MapContainer = styled(Box)`
  position: relative;
  grid-column: span 3;
  width: 100%;
  height: 600px;
  min-width: 500px;
  min-height: 600px;

  resize: both;
  overflow: auto;

  padding: 5px;

  ${theme.breakpoints.down('md')} {
      min-width: unset;
  }

  ${theme.breakpoints.up('md')} {
    @media (pointer: fine) {
      &:hover {
        &::after {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          background-color: #fbc600;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
      }
    }
  }
`;
