import {
  styled, Modal, Box, Switch, IconButton, Button,
} from '@mui/material';
import { theme } from '../../pages/themes/default';

const colors = {
  primary: theme.palette.primary.main,
  white: theme.palette.background.default,
  darkgray: theme.palette.text.main,
};

export const ModalContainer = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;

  ${theme.breakpoints.down('md')} {
    touch-action: none;
  }

  ${theme.breakpoints.down('sm')} {
    padding: 0;
    margin: 0;
  }
`;

export const PaperFade = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 700px;
  height: 100%;
  max-height: 95vh;
  max-width: 735px;

  padding-bottom: 20px;
  background-color: ${colors.white};
  border-radius: 10px;
  overflow: auto;
  
  ${theme.breakpoints.down('md')} {
    height: 900px;
  }

  ${theme.breakpoints.down('sm')} {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    overflow: hidden;
  }
`;

export const CloseButton = styled(IconButton)`
  position: absolute;
  top: 10px;
  right: 10px;

  width: 40px;
  height: 40px;

  z-index: 1;
  
  svg {
    color: ${colors.white};
  }
`;

export const ImageContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;

  img {
    margin-top: 200px;
    height: 115vh;
  };

  button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 50px;

    border: none;
    cursor: pointer;

    svg {
      transition: all 0.2s ease-in-out;

      path {
        color: ${colors.primary};
      };
    };
  };
`;

export const NavigatePhotoButton = styled(IconButton)`
  position: absolute;
  margin: 8px;

  width: 40px !important;
  height: 40px !important;
  background-color: rgba(255,255,255,0.6);
  z-index: 1;
  
  &:hover {
    background-color: rgba(255,255,255,0.8);
    
    svg {
      transition: all 0.2s ease-in-out;
      transform: scale(1.5);
    }
  }
`;

export const ImageArea = styled(Box)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export const LoadingContent = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;

  height: 85px;
  width: 85px;
`;

export const ImageControls = styled(Box)`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 90%;
  width: 500px;
  bottom: 20px;
  padding: 10px;

  .MuiFormControlLabel-root {
    margin: 0;
  };

  legend {
    color: ${colors.white};
    font-size: 12px;
  };
`;

export const ClaheSwitch = styled(Switch)`
  background-color: rgba(255,255,255,0.8);
  border-radius: 8px;
  margin-bottom: 6px;
`;

export const DownloadButton = styled(Button)`
  border: none;
  cursor: pointer;

  svg {
    width: 32px;
    height: 32px;
    transition: all 0.3s ease;

    path {
      fill: ${colors.white};
    }
  };

  &:hover {
    background-color: rgba(255,255,255,0.8);
      
    path {
      fill: ${colors.primary};
    }
  };
`;

export const InfoContent = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 330px;
  height: 80px;
  margin: 10px auto 0;

  color: ${colors.primary};
  line-height: 22px;

  div {
    &:first-of-type {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      
      text-align: center;
      font-weight: bold;

      p {
        &:first-of-type {
          font-size: 20px;
          margin-bottom: 6px;
        }

        &:last-of-type {
          font-size: 36px;
        }
      }
    }
    
    &:last-of-type {
      font-size: 14px;

      p {
        display: flex;
        align-items: center;
        margin: 4px 0;

        svg {
          margin-right: 4px;
        }
      }
    }
  }
`;
