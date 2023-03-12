import React from 'react';

import { Container, Description } from './styles';
import { DefaultLayout } from '../../layouts/main';

import { HelmetHead } from '../../components/HelmetHead';

export function Dashboard() {
  return (
    <>
      <HelmetHead title="Dashboard | Leafsense" />
      <DefaultLayout>
        <Container>
          <h3>Nenhum relatório selecionado</h3>

          <div>
            <img src="/assets/leaf.png" alt="Empty" />

            <Description>
              Para começar a ver os dados das suas fazendas, crie ou selecione
              um relatório.
            </Description>
          </div>
        </Container>
      </DefaultLayout>
    </>
  );
}
