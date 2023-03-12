import React from 'react';

import { Container, MobileContainer } from './styles';

import { ReportDetail } from '../../containers/ReportDetail';
import { DefaultLayout } from '../../layouts/main';

import { HelmetHead } from '../../components/HelmetHead';
import { FilterChart } from '../../containers/FilterChart';
import { Sidebar } from '../../components/Sidebar';

export function Report() {
  return (
    <>
      <HelmetHead title="Report | Leafsense" />
      <DefaultLayout>
        <Container>
          <FilterChart />

          <MobileContainer component="aside">
            <Sidebar />
          </MobileContainer>

          <ReportDetail />
        </Container>
      </DefaultLayout>
    </>
  );
}
