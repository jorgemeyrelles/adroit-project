import { styled, Container } from '@mui/material';
import { theme } from '../../pages/themes/default';

export const Wrapper = styled('main')`
  position: relative;
  height: 100%;  
  padding-bottom: 3rem;
  background-color: #ffffff;
  
  ${theme.breakpoints.down('md')} {
    padding-bottom: 0;
  }
`;

export const DashboardContainer = styled(Container)`
  position: relative;

  ${theme.breakpoints.down('md')} {
    height: 100%;
  }
`;

export const ReportTitle = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
