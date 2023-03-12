import { IconButton, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';

const primaryColor = (props) => props.theme.palette.primary.main;

export const Container = styled('div')`
  display: flex;
`;

export const Icon = styled(IconButton)`
  svg {
    width: 2rem;
    height: 2rem;
    color: #747474;
    transition: color .3s ease-in-out;
    
    &:hover {
      color: ${primaryColor};
    }
  }
`;

export const Popup = styled(Popover)`
  .MuiPaper-root {
    box-shadow: none;
    border: 2px solid ${primaryColor};
    color: ${primaryColor};
    border-radius: 10px;
    
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .MuiList-padding {
    padding-top: 0;
    padding-bottom: 0;
  }

  .MuiButtonBase-root {
    display: flex;
    gap: 1rem;
    transition: all .3s ease-in-out;
    padding: 0 10px;

    p {
      color: ${primaryColor};
    }
    
    svg {
      color: ${primaryColor};
    }

    &:hover {
      background-color: ${primaryColor};
      
      p {
        color: white;
      }
    
      svg {
        color: white;
      }
    }
  }
`;
