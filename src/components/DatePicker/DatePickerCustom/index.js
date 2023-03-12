import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ptBR } from 'date-fns/locale';
import { addDays, parseISO, subDays } from 'date-fns';

import DateFnsUtils from '@date-io/date-fns';

import { MobileDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Alert, CircularProgress, IconButton, Slide, Snackbar, TextField,
} from '@mui/material';
import { KeyboardReturn } from '@mui/icons-material';
import { StateGlobal } from '../../../context/StateGlobal';
import { Container } from './styles';

export function DatePickerCustom(prop) {
  const {
    setStartDate,
    setEndDate,
    visited,
    period,
    // currentReport,
    setCustom,
  } = useContext(StateGlobal);

  const [localStartDate, setLocalStartDate] = useState(null);
  const [localEndDate, setLocalEndDate] = useState(null);
  const { disabled, setSelectedCycle } = prop;

  const disableDates = (date) => {
    const filteredVisitedDates = visited.map((e) => new Date(e.replace(/-/g, '/')));
    const dateTimeArray = filteredVisitedDates.map((arrVal) => arrVal.getTime());
    return !dateTimeArray.includes(date.getTime());
  };

  const [err, setErr] = useState({ status: false, message: '' });

  useEffect(() => {
    const setHourStart = localStartDate && localStartDate.setHours(1, 0, 0, 0);
    const setHourEnd = localEndDate && localEndDate.setHours(23, 0, 0, 0);

    if (localStartDate && localEndDate && (setHourStart > setHourEnd)) {
      setErr({ status: true, message: 'Data final menor' });
      setStartDate(parseISO(visited[visited.length - 1]));
      setEndDate(parseISO(visited[visited.length - 1]));
    }
  }, [localStartDate, localEndDate]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErr({ status: false, message: '' });
  };

  return (
    <Container>
      <IconButton
        aria-label="delete"
        size="small"
        disabled={disabled}
        onClick={() => {
          setSelectedCycle('30 dias da última coleta');
          setCustom(false);
        }}
      >
        <KeyboardReturn fontSize="small" />
      </IconButton>
      <LocalizationProvider
        adapterLocale={ptBR}
        dateAdapter={DateFnsUtils}
      >
        <MobileDatePicker
          label="Data Inicial"
          disabled={disabled}
          disableFuture
          inputFormat="dd/MM/yyyy"
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!err.status}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {
                      disabled
                        ? (
                          <CircularProgress
                            style={{ position: 'absolute', right: 10 }}
                            color="inherit"
                            size={20}
                          />
                        )
                        : null
                    }
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          shouldDisableDate={(e) => disableDates(e)}
          maxDate={addDays(parseISO(visited[visited.length - 1]), 2)}
          minDate={subDays(parseISO(visited[0]), 2)}
          showToolbar={false}
          closeOnSelect
          value={period.startDate}
          onChange={(e) => {
            setStartDate(new Date(e));
            setLocalStartDate(e);
          }}

        />
      </LocalizationProvider>

      <LocalizationProvider
        adapterLocale={ptBR}
        dateAdapter={DateFnsUtils}
      >
        <MobileDatePicker
          label="Data Final"
          disabled={disabled}
          disableFuture
          inputFormat="dd/MM/yyyy"
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!err.status}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {
                      disabled
                        ? (
                          <CircularProgress
                            style={{ position: 'absolute', right: 10 }}
                            color="inherit"
                            size={20}
                          />
                        )
                        : null
                    }
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          shouldDisableDate={(e) => disableDates(e)}
          maxDate={addDays(parseISO(visited[visited.length - 1]), 2)}
          minDate={subDays(parseISO(visited[0]), 2)}
          showToolbar={false}
          closeOnSelect
          value={period.endDate}
          onChange={(e) => {
            setEndDate(new Date(e));
            setLocalEndDate(e);
          }}
        />
      </LocalizationProvider>

      <Snackbar
        open={err.status}
        onClose={() => handleClose()}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={(props) => <Slide {...props} direction="down" />}
        key={err.message}
        autoHideDuration={6000}
      >
        <Alert
          variant="filled"
          onClose={() => handleClose()}
          severity="error"
          style={{
            padding: '6px 10px',
          }}
        >
          {err.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

DatePickerCustom.propTypes = {
  prop: PropTypes.node,
}.isRequired;
