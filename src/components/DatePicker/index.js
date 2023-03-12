import React, { useContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { parseISO, subDays } from 'date-fns';
import {
  Container, FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import { StateGlobal } from '../../context/StateGlobal';
import { DatePickerCustom } from './DatePickerCustom';

export function DatePicker(props) {
  const { loading, disabledCustom } = props;
  const [selectedCycle, setSelectedCycle] = useState('');
  const {
    setStartDate, setEndDate, visited, custom, setCustom,
  } = useContext(StateGlobal);

  useEffect(() => {
    if (selectedCycle === '' || selectedCycle === '30 dias da última coleta') {
      if (visited) {
        const lastVisitedDate = parseISO(visited[visited.length - 1]);

        setStartDate(subDays(lastVisitedDate, 30));
        setEndDate(lastVisitedDate);
      }
    }

    if (selectedCycle === 'Escolher período') {
      setCustom(true);
    } else {
      setCustom(false);
    }
  }, [selectedCycle]);

  const handleCycleSelection = (e) => {
    setSelectedCycle(e.target.value);
  };

  return (
    <Container
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: '0 !important',
      }}
    >
      {custom || selectedCycle === 'Escolher período' ? (
        <DatePickerCustom
          loading={loading}
          setSelectedCycle={setSelectedCycle}
          disabled={disabledCustom}
        />
      ) : (
        <FormControl
          variant="outlined"
          disabled={!loading}
        >
          <InputLabel id="select-input-label">Selecionar ciclo</InputLabel>
          <Select
            labelId="select-input-label"
            id="select-input"
            value={selectedCycle || '30 dias da última coleta'}
            onChange={handleCycleSelection}
            label="Selecionar ciclo"
            style={{ width: '210px' }}
          >
            <MenuItem key={1} value="30 dias da última coleta">30 dias da última coleta</MenuItem>
            <MenuItem key={2} value="Escolher período">Escolher período</MenuItem>
          </Select>
        </FormControl>
      )}
    </Container>
  );
}

DatePicker.propTypes = {
  props: PropTypes.node,
}.isRequired;
