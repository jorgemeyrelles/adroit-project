import { styled, Toolbar } from '@mui/material';

const primaryColor = (props) => props.theme.palette.primary.main;

export const Container = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  padding: 0 !important;
`;

export const Commit = styled('div')`
  flex-direction: column;
  align-items: start;
  background-color: ${primaryColor};
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  white-space: pre;

  & span {
    max-width: 250px;
    overflow-x: hidden;
    text-overflow: ellipsis;
    display: block;
    cursor: default;
  }
  
  & > span {
    display: flex;
  }

  .branch {
    font-weight: bold;
  }

  .textCommit {
    color: #fefefe;
    font-weight: bold;
  }

  .version {
    text-align: center;
    font-size: 12px;
  }
`;
