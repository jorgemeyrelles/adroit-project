import {
  styled, Box, IconButton, Button,
} from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.default,
  darkgray: theme.palette.text.main,
};

export const Container = styled(Box)`
  position: relative;

  display: flex;
  justify-content: center;

  width: 100%;
  height: 100%;

  border-radius: 10px;
  overflow: hidden;
`;

export const MapOptionsButton = styled(IconButton)`
  background-color: ${colors.white};
  font-size: 14px;
  margin: 10px;
  
  &:hover {
    background-color: ${colors.white};
    color: ${colors.darkgray};
  }
`;

export const LoadingContainer = styled(Box)`
  z-index: 1;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

export const LoadingContent = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.white};
  border-radius: 10px;
  height: 85px;
  width: 85px;
`;

export const BlockView = styled(Box)`
  position: absolute;
  top: 10px;
  right: 70px;

  min-width: 90px;
  max-width: 150px;
  padding: 5px 10px;
  font-size: 1rem;

  text-align: center;
  border-radius: 6px;
  background-color: ${colors.white};

  p {
    color: ${colors.darkgray};
  }

`;

export const ImageContainer = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 380px;
  overflow: hidden;

  img {
    height: 101%;
  }

  button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    z-index: 9;

    svg {
      color: ${colors.white};
    }
  }
`;

export const InfoContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background-color: ${colors.white};
  color: ${colors.primary};
  line-height: 20px;
  padding: 10px 20px;

  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 150px;
    height: 50px;
  }

  h3 {
    font-size: 16px;

    ${theme.breakpoints.down('md')} {
      font-size: 18px;
      margin-bottom: 4px;
    }
  }

  span {
    font-size: 12px;

    ${theme.breakpoints.down('md')} {
      font-size: 14px;
      
      &:last-of-type {
        display: none;
      }
    }
  }
`;

export const ExpanseButton = styled(Button)`
  width: 100px;
  justify-content: center;
  align-items: center;

  border: 2px solid ${colors.primary};
  border-radius: 10px;
  text-transform: uppercase;
  font-weight: 500px;
  
  &:hover {
    border: 2px solid ${colors.white};
    background-color: ${colors.primary};
    color: ${colors.white};
  }
`;
