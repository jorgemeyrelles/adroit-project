import React from 'react';
import PropTypes from 'prop-types';

import {
  Box, Card, Skeleton, Typography,
} from '@mui/material';
import { CardContainer } from './styles';

function generateCardsArray(length = 5) {
  return [...new Array(length)].map((_, index) => index);
}

export function ReportSummaryShimmer({ length = 5 }) {
  const items = generateCardsArray(length);

  return (
    <>
      {items.map((item) => (
        <Card key={item}>
          <CardContainer>
            <img src="/assets/leaf_blue.png" alt="leaf blue" />

            <Box marginLeft="14px">
              <Skeleton width={100}>
                <Typography variant="h5">0</Typography>
              </Skeleton>

              <Skeleton width={60}>
                <Typography>Verde Anomalia</Typography>
              </Skeleton>
            </Box>
          </CardContainer>
        </Card>
      ))}
    </>
  );
}

ReportSummaryShimmer.propTypes = {
  length: PropTypes.number,
}.isRequired;
