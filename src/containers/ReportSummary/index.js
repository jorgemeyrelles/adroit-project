import React, { useContext, useMemo } from 'react';

import { Box, Card, Typography } from '@mui/material';
import { ReportSummaryShimmer } from './ReportSummaryShimmer';

import { ChartContext } from '../../context/ChartContext';
import { CardContainer } from './styles';

export function ReportSummary() {
  const { getSummaryResponse } = useContext(ChartContext);
  const id = window.location.pathname[1];

  const summaryResp = useMemo(() => {
    const { loading, data } = getSummaryResponse;

    const cards = [
      'Fruta Madura',
      'Fruta Verde',
      'Madura Anomalia',
      'Verde Anomalia',
      'Fruta Semi Madura',
    ];

    if (!data || !data?.summary) {
      return {
        loading: false,
        data: cards.map((card) => ({ name: card, total: 0 })),
      };
    }

    return {
      loading,
      data: data?.summary.map((card) => ({
        name: card.name,
        total: new Intl.NumberFormat('pt-BR').format(card.total),
      })),
    };
  }, [getSummaryResponse, id]);

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 16,
        width: '100%',
      }}
    >
      {summaryResp.loading ? (
        <ReportSummaryShimmer />
      ) : (
        <>
          {summaryResp.data.map((card) => (
            <Card key={card.name}>
              <CardContainer>
                <img src="/assets/leaf_blue.png" alt="leaf blue" />

                <Box marginLeft="14px">
                  <Typography variant="h5">{card.total}</Typography>
                  <Typography>{card.name}</Typography>
                </Box>
              </CardContainer>
            </Card>
          ))}
        </>
      )}
    </section>
  );
}
