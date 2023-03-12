import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { CircularProgress } from '@mui/material';
import { ChartContext } from '../../../context/ChartContext';
import { ContentEmpty, Description } from './styles';

export function EmptyReportDetail() {
  const {
    data,
  } = useContext(ChartContext);

  const validationLoading = (Object.values(data)
    .map(({ loading }) => loading)).every((i) => i === true);

  if (validationLoading) {
    return (
      <ContentEmpty>
        <img
          src="/assets/leaf.png"
          alt="Leaf"
        />
        <Description>
          Para começar a ver os dados das suas fazendas, selecione um dos gráficos disponíveis.
        </Description>
      </ContentEmpty>
    );
  }

  return (
    <ContentEmpty>
      <img
        src="/assets/leaf.png"
        alt="Leaf"
      />
      <div style={{ position: 'absolute' }}>
        {!validationLoading
          && (
            <CircularProgress
              color="primary"
              size="3rem"
            />
          )}
      </div>
    </ContentEmpty>
  );
}

EmptyReportDetail.propTypes = {
  props: PropTypes.node,
}.isRequired;
