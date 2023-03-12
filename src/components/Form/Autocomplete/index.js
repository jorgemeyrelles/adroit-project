import React from 'react';
import PropTypes from 'prop-types';
import {
  Badge, Button, CircularProgress, Popper, TextField,
} from '@mui/material';
import {
  FarmNames, GroupedButtons, OptionNames, StyledAutocomplete,
} from './styles';

export function AutocompleteInput(props) {
  const {
    label,
    width,
    options,
    onClose,
    loading,
    disabled,
    setSelectedOptions,
    selectedOptions,
  } = props;

  const allNames = selectedOptions.map((i) => i.name);

  return (
    <StyledAutocomplete
      multiple
      disabled={disabled}
      onClose={onClose}
      options={options}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      value={selectedOptions}
      disableClearable
      onChange={(e, value, statusClicked, selected) => {
        const filtered = selectedOptions.filter((elem) => elem.name !== selected.option.name);
        if (selectedOptions.length === 1 && filtered.length === 0) {
          return setSelectedOptions([]);
        }
        if (allNames.includes(selected.option.name)) {
          return setSelectedOptions(filtered);
        }
        return setSelectedOptions((update) => [...update, selected.option]);
      }}
      disableCloseOnSelect={label !== 'Fazenda' && selectedOptions.name !== 1}
      getOptionLabel={(option) => option.name}
      noOptionsText={<CircularProgress />}
      renderTags={() => { }}
      renderOption={(prop, option) => {
        if (label === 'Fazenda') {
          return (
            <FarmNames
              {...prop}
              color="primary"
              key={String(option.name)}
            >
              {option.name}
            </FarmNames>
          );
        }
        return (
          <OptionNames
            title={option.name}
            style={{
              backgroundColor: allNames.includes(option.name) ? '#2B4976' : '',
              color: allNames.includes(option.name) ? '#fefefe' : '#2B4976',
            }}
            {...prop}
            key={String(option.name)}
          >
            {option.name}
          </OptionNames>
        );
      }}
      style={{
        width,
        margin: 0,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          value={selectedOptions}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {
                  loading
                    ? <CircularProgress color="inherit" size={20} />
                    : (
                      <Badge
                        badgeContent={!!selectedOptions[0]
                          && selectedOptions.length > 0 ? selectedOptions.length : null}
                        color="primary"
                      />
                    )
                }
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          placeholder={label}
          fullWidth
        />
      )}
      PopperComponent={({ children, ...popperProps }) => (
        <Popper style={{ padding: '0' }} {...popperProps}>
          {label !== 'Fazenda' && (
            <GroupedButtons color="primary">
              <Button
                sx={{ my: 0.5, borderRadius: 0 }}
                variant="contained"
                onMouseDown={() => {
                  setSelectedOptions(options);
                }}
              >
                Selecionar todos
              </Button>

              <Button
                sx={{ borderRadius: 0 }}
                variant="contained"
                onMouseDown={() => {
                  setSelectedOptions([]);
                }}
              >
                Limpar campos
              </Button>
            </GroupedButtons>
          )}
          {children}
        </Popper>
      )}
    />
  );
}

AutocompleteInput.propTypes = {
  props: PropTypes.node,
}.isRequired;
