import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useNavigate } from 'react-router';
import { Header } from '../../components/Header';

import { StateGlobal } from '../../context/StateGlobal';
import { isExpiredToken } from '../../utils/getValidationErrors';

import { ReportsBar } from '../../components/ReportsBar';
import { ReportModal } from '../../containers/ReportModal';
import { UpdateModal } from '../../containers/ReportModal/UpdateModal';
import { DashboardContainer, ReportTitle, Wrapper } from './styles';

export function DefaultLayout({ children }) {
  const { update } = useContext(StateGlobal);

  const navigate = useNavigate();
  const local = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    // autoredirect to login if token is invalid or null
    if (isExpiredToken(local)) {
      localStorage.clear();
      return navigate('/');
    }
    return false;
  }, []);

  return (
    <Wrapper>
      <DashboardContainer maxWidth="xl">
        <Header />

        {!update.loading && <ReportModal />}
        {update.loading && <UpdateModal />}

        <ReportTitle>
          <h3>Meus relatórios:</h3>
        </ReportTitle>

        <ReportsBar />

        {children}
      </DashboardContainer>
    </Wrapper>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.node,
}.isRequired;
