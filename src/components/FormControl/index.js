import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import {
  Checkbox, FormControlLabel, FormControl, ClickAwayListener,
} from '@mui/material';
import { StateGlobal } from '../../context/StateGlobal';
import { FormButton, FormControlTooltip, FormGroupContainer } from './styles';

export function FormControlComponent(props) {
  const { filterBar, setFilterBar } = useContext(StateGlobal);
  const { namebtn, selectedReport } = props;
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const infoFromType = (type) => {
    switch (type) {
      case 'blocks':
        return 'Blocos';
      case 'varieties':
        return 'Variedades';
      case 'ages':
        return 'Idade';
      case 'grafts':
        return 'Enxerto';
      default:
        return 'Espaçamento';
    }
  };

  const handleCloseTooltip = () => {
    setIsTooltipOpen(false);
  };

  const handleOpenTooltip = () => {
    setIsTooltipOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleCloseTooltip}>
      <div>
        <FormControlTooltip
          arrow
          disableFocusListener
          disableHoverListener
          disableTouchListener
          placement="bottom"
          onClose={handleCloseTooltip}
          open={isTooltipOpen}
          interactive="true"
          title={(
            <FormControl
              component="fieldset"
              sx={{ p: 1 }}
            >
              <h3>{namebtn && infoFromType(namebtn)}</h3>
              {selectedReport.length > 0 ? (
                <FormGroupContainer>
                  <div style={{
                    display: namebtn === 'blocks' && 'grid',
                    gridTemplateColumns: namebtn === 'blocks' && 'auto auto auto auto',
                    justifyContent: namebtn === 'blocks' && 'space-around',
                  }}
                  >
                    {selectedReport.map((info) => (
                      <div
                        key={`${info.name}-${infoFromType(namebtn)}`}
                      >
                        <FormControlLabel
                          key={info.name}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              color: '#fff',
                            },
                          }}
                          control={(
                            <Checkbox
                              key={info.id}
                              style={{ color: !filterBar.find((is) => is.namebtn === info.name) && '#fff' }}
                              checked={!filterBar.find((is) => is.name === info.name)}
                              onChange={() => {
                                if (filterBar.length > 0 && filterBar
                                  .find((is) => is.name === info.name)) {
                                  setFilterBar((e) => e.filter((i) => i.name !== info.name));
                                } else {
                                  setFilterBar((e) => [...e, { ...info, type: namebtn }]);
                                }
                              }}
                              name={info.name}
                            />
                          )}
                          label={info.name}
                        />
                      </div>
                    ))}
                  </div>
                </FormGroupContainer>
              ) : <div>Nenhuma informação</div>}
            </FormControl>
          )}
        >
          <FormButton
            variant="outlined"
            color="primary"
            style={{
              borderRadius: namebtn === 'blocks' ? '10px 0 0 10px' : '0',
            }}
            component={selectedReport.length === 0 ? 'div' : undefined}
            disabled={selectedReport.length === 0}
            onClick={handleOpenTooltip}
          >
            {namebtn && infoFromType(namebtn)}
          </FormButton>
        </FormControlTooltip>
      </div>
    </ClickAwayListener>
  );
}

FormControlComponent.propTypes = {
  props: PropTypes.node,
  namebtn: PropTypes.string,
  selectedReport: PropTypes.object,
}.isRequired;
