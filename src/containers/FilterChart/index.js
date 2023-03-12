import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  ButtonGroup, ClickAwayListener, Tooltip,
} from '@mui/material';
import { ClearAll, FilterList } from '@mui/icons-material';
import {
  ClearButton, ClearButtonActive, Container, FilterButton,
} from './styles';

import { FormControlComponent } from '../../components/FormControl';
import { keysToFilter } from '../../constants';
import { farmById } from '../../service/api';
import { getKeysOrganized } from '../../utils/format';
import { ChartContext } from '../../context/ChartContext';
import { isExpiredToken } from '../../utils/getValidationErrors';
import { StateGlobal } from '../../context/StateGlobal';

export function FilterChart() {
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const {
    isLoading,
    selectedReport,
    setSelectedReport,
    setOrganizedKeysByblocks,
  } = useContext(ChartContext);

  const { filterBar, setFilterBar } = useContext(StateGlobal);

  const local = JSON.parse(localStorage.getItem('report'));
  const token = JSON.parse(localStorage.getItem('token'));
  const { id } = useParams();
  const { farm } = local.find((rep) => rep.report_id === id);

  useEffect(() => {
    const getInfoByBlock = async () => {
      try {
        setShowFilter(false);
        const data = await farmById(token, farm[0].id);
        const objOrganized = getKeysOrganized(data);
        setSelectedReport(() => objOrganized);
        setOrganizedKeysByblocks(() => data);
      } catch {
        if (isExpiredToken(token)) {
          localStorage.clear();
          return navigate('/');
        }
      }
      return false;
    };

    if (Object.entries(selectedReport).length === 0) {
      getInfoByBlock();
    }
  }, [id]);

  const validationLoading = id ? Object.values(isLoading).every((e) => e === false) : true;

  const handleClickAway = () => {
    setShowFilter(false);
  };

  try {
    return (
      <ClickAwayListener onClickAway={handleClickAway}>
        <Container>
          <ButtonGroup
            variant="outlined"
            color="primary"
            aria-label="outlined primary button group"
            style={{
              width: 'auto',
              backgroundColor: '#fff',
              borderRadius: '10px',
              alignItems: 'center',
              height: '41px',
            }}
          >
            {(showFilter && Object.entries(selectedReport).length > 0)
              && Object.entries(selectedReport).map((obj) => {
                if (keysToFilter.includes(obj[0])) {
                  return (
                    <FormControlComponent
                      namebtn={obj[0]}
                      selectedReport={selectedReport[obj[0]]}
                      key={obj[0]}
                    />
                  );
                }
                return false;
              })}
            {(showFilter && Object.entries(selectedReport).length > 0) && (
              <Tooltip
                placement="top"
                title="Limpar filtro"
              >
                {filterBar.length !== 0
                  ? (
                    <ClearButtonActive
                      component={filterBar.length === 0 ? 'div' : undefined}
                      onClick={() => setFilterBar([])}
                    >
                      <ClearAll />
                    </ClearButtonActive>
                  ) : (
                    <ClearButton>
                      <ClearAll />
                    </ClearButton>
                  )}
              </Tooltip>
            )}
            <FilterButton
              title="Filtro de gráficos"
              disabled={!validationLoading}
              onClick={() => setShowFilter((e) => !e)}
              style={{
                borderRadius: showFilter ? '0 10px 10px 0' : '10px',
                borderWidth: '2px',
              }}
            >
              <FilterList />
            </FilterButton>
          </ButtonGroup>
        </Container>
      </ClickAwayListener>
    );
  } catch (error) {
    return (error);
  }
}
