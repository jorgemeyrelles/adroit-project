import React, {
  useContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { parseISO } from 'date-fns';

import {
  Box, IconButton, Typography,
} from '@mui/material';
import { Add, HighlightOff, Remove } from '@mui/icons-material';
import { formatDate, getAge } from '../../utils/format';
import {
  AdjustSize,
  ChartHeader, CloseButton, Container, Period,
} from './styles';

import { StateGlobal } from '../../context/StateGlobal';
import { ChartContext } from '../../context/ChartContext';

export function ChartDetail(props) {
  const [allBlocks, setAllBlocks] = useState([]);

  const {
    chartName, blockName, children, variables,
    customWidth, handleSizeChange, showSizeButton, ...rest
  } = props;
  const { period, filterBar } = useContext(StateGlobal);
  const {
    organizedKeysByblocks,
  } = useContext(ChartContext);

  const { formatedStartDate, formatedEndDate } = useMemo(
    () => ({
      formatedStartDate: formatDate(
        parseISO(new Date(variables.startDate || 0).toISOString()),
      ),
      formatedEndDate: formatDate(
        parseISO(new Date(variables.endDate || 0).toISOString()),
      ),
    }),
    [period, variables],
  );

  useMemo(() => {
    const getData = async () => {
      const responseBlocks = filterBar.map((i) => i.name);
      setAllBlocks(responseBlocks);
      const data = await organizedKeysByblocks;
      if (filterBar.find(({ type }) => type === 'spacing')) {
        const responseSpancing = (data
          .find((each) => (each.cod_block === Number(blockName)
            && responseBlocks.includes(`${each.espacamento} m`))))?.cod_block || '';
        setAllBlocks((e) => [...e, `${responseSpancing}`]);
      }
      if (filterBar.find(({ type }) => type === 'varieties')) {
        const responseVariety = (data
          .find((each) => (each.cod_block === Number(blockName)
            && responseBlocks.includes(each.nome_varieade))))?.cod_block || '';
        setAllBlocks((e) => [...e, `${responseVariety}`]);
      }
      if (filterBar.find(({ type }) => type === 'grafts')) {
        const responseGrafts = (data
          .find((each) => (each.cod_block === Number(blockName)
            && responseBlocks.includes(each.nome_enxerto))))?.cod_block || '';
        setAllBlocks((e) => [...e, `${responseGrafts}`]);
      }
      if (filterBar.find(({ type }) => type === 'ages')) {
        const responseAges = (data
          .find((each) => {
            const age = getAge(each.plating_date, each.visit_date);
            return (each.cod_block === Number(blockName)
              && responseBlocks.includes(age.name));
          }))?.cod_block || '';
        setAllBlocks((e) => [...e, `${responseAges}`]);
      }
    };

    getData();
  }, [filterBar]);

  const [chosenWidth, setChosenWidth] = useState('32.5%');

  const handleSize = (val) => {
    handleSizeChange(val);
    setChosenWidth(val);
  };

  return (
    (!allBlocks.includes(blockName)) && (
      <Container sx={{ width: chosenWidth }} {...rest}>
        <ChartHeader>
          {chartName === 'Quantidade de Frutos'
            ? (
              <Typography
                style={{
                  fontSize: '1.5rem',
                  lineHeight: '1.4rem',
                }}
              >
                {chartName}
              </Typography>
            ) : (
              <Typography
                style={{
                  maxWidth: 200,
                  marginRight: 25,
                  whiteSpace: 'normal',
                  fontSize: '1.2rem',
                  lineHeight: '1.4rem',
                }}
              >
                {chartName}
                {blockName && (
                  <span>
                    Quadra:
                    {` ${blockName}`}
                  </span>
                )}
              </Typography>

            )}

          <Period>
            <Typography>
              {`De: ${formatedStartDate}`}
            </Typography>
            <Typography>
              {`Até: ${formatedEndDate}`}
            </Typography>

            <CloseButton
              size="large"
              onClick={() => setAllBlocks((e) => [...e, blockName])}
            >
              <HighlightOff
                style={{ color: '#8b0000', width: '50px' }}
              />
            </CloseButton>
          </Period>

        </ChartHeader>

        <Box
          component="footer"
          sx={{
            textAlign: '-webkit-center',
            mt: chartName === 'Quantidade de Frutos'
              ? '20px' : '30px',
          }}
        >
          {children}
        </Box>
        <AdjustSize>
          {showSizeButton && (
            <>
              <span>Ajustar tamanho</span>
              <IconButton onClick={() => handleSize('32.5%')}>
                <Remove fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleSize('99.8%')}>
                <Add fontSize="small" />
              </IconButton>
            </>
          )}
        </AdjustSize>
      </Container>
    )
  );
}

ChartDetail.propTypes = {
  props: PropTypes.node,
}.isRequired;
