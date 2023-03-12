import {
  styled, Dialog, DialogContent, IconButton,
} from '@mui/material';

export const Modal = styled(Dialog)`
  max-width: 700px;
  margin: 0 auto;
`;

export const TextArea = styled(DialogContent)`
  p:last-of-type {
    margin-top: 5px;
    font-size: 14px;
    color: ${(props) => props.theme.palette.warning.main};
  }
`;

export const DecisionArea = styled(DialogContent)`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 15px;

  & button {
    margin-right: 10px;
  };

  & button:last-of-type {
    text-decoration: none;
    font-family: 'Mukta';
    font-size: 14px;
    height: 40px;
    padding: 8px 20px;

    text-transform: uppercase;
    color: ${(props) => props.theme.palette.background.default};
    border-radius: 10px;
    background-color: ${(props) => props.theme.palette.primary.main};

    &:disabled {
      background-color: ${(props) => props.theme.palette.text.light};
      cursor: not-allowed;
    }
  }
`;

export const CloseButton = styled(IconButton)`
  position: absolute;
  right: 0;
`;
