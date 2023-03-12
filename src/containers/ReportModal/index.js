import React, {
  useMemo,
  useState,
  useEffect,
  useContext,
} from 'react';

import { useNavigate } from 'react-router';

import { format, parseISO } from 'date-fns';

import {
  Box, Chip, FormControl, InputLabel, Select, TextField, Typography, useMediaQuery,
} from '@mui/material';
import { Cancel, MoreHoriz, KeyboardReturn } from '@mui/icons-material';

import axios from 'axios';
import { Modal } from '../../components/Modal';
import { AutocompleteInput } from '../../components/Form/Autocomplete';
import {
  formatModal, filteringModal, dispensableKeys, formatEndDate,
} from '../../utils/format';

import {
  ButtonFilter,
  Content,
  CopyForm, InputContainer, ReportDataBox,
} from './styles';
import { StateGlobal } from '../../context/StateGlobal';
import { api } from '../../service/api';
import { ChartContext } from '../../context/ChartContext';
import { DatePicker } from '../../components/DatePicker';
import { apiReports } from '../../service/apiReports';
import { MapContext } from '../../context/MapContext';
import { getValidationErrors, isExpiredToken } from '../../utils/getValidationErrors';
import { storage } from '../../utils/hooks/useLocalStorage';

export function ReportModal() {
  const {
    createReportModalVisibility,
    setCreateReportModalVisibility,
    period,
    setEndDate,
    setStartDate,
    setVisited,
    visited,
  } = useContext(StateGlobal);

  const {
    setParams,
    setChartsSelected,
  } = useContext(ChartContext);

  const { clearHeatmaps, setSelectedMap } = useContext(MapContext);

  const [nameReport, setNameReport] = useState('');
  const [selectedReport, setSelectedReport] = useState('');

  const [selectedFarms, setSelectedFarms] = useState([]);
  const [selectedVarietiesFarms, setSelectedVarietiesFarms] = useState([]);
  const [selectedSpacingsFarms, setSelectedSpacingsFarms] = useState([]);
  const [selectedAgesFarms, setSelectedAgesFarms] = useState([]);
  const [selectedGraftsFarms, setSelectedGraftsFarms] = useState([]);
  const [selectedBlocksFarms, setSelectedBlocksFarms] = useState([]);

  const [loadingHere, setLoadingHere] = useState(false);
  const [dataFromFarm, setDataFromFarm] = useState([]);
  const [open, setOpen] = useState(false);

  const mobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleDetectMobile = () => {
    if (mobile) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (mobile) handleDetectMobile();
  }, [mobile]);

  const navigate = useNavigate();

  const token = storage.get('token');

  useEffect(() => {
    if (dataFromFarm && visited) {
      setEndDate(parseISO(visited[visited.length - 1]));
      setStartDate(parseISO(visited[visited.length - 1]));
    }

    return () => {
      setEndDate(parseISO(visited[visited.length - 1]));
      setStartDate(parseISO(visited[visited.length - 1]));
    };
  }, [dataFromFarm, visited]);

  const sortedSelectedAges = selectedAgesFarms.sort((a, b) => a.id - b.id);
  const sortedSelectedBlocks = selectedBlocksFarms.sort((a, b) => a.name - b.name);

  // *** FARMS ***
  const [farms, setFarms] = useState([]);
  useMemo(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let isMounted = true;

    if (!token || token === '') {
      return [];
    }

    const verify = (createReportModalVisibility && isMounted && !farms.length);

    if (verify) {
      api.getClients(source)
        .then((data) => {
          const arrFarm = [];
          data.map((e) => {
            if (arrFarm.every((i) => Number(i.id) !== Number(e.property_id))) {
              arrFarm.push({ name: e.name, id: Number(e.property_id) });
            }
            return false;
          });
          return setFarms(arrFarm);
        })
        .catch((error) => {
          if (isExpiredToken(token)) {
            storage.clean();
            return navigate('/');
          }
          return error;
        });
    }

    return () => {
      isMounted = false;
      source.cancel('axios request cancelled');
    };
  }, [createReportModalVisibility, farms]);

  const reports = useMemo(() => {
    const localRep = storage.get('report');

    if (localRep) {
      return localRep;
    }
    return ([{
      name: '', id: '', farms: '', block: '', spacing: '', variety: '', age: '',
    }]);
  }, []);

  useMemo(() => {
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();
    let isMounted = true;

    if (isMounted && selectedFarms.length === 1) {
      api.getBlocksByFarmId(selectedFarms[0].id, source)
        .then((data) => {
          const visitDates = data.map((date) => date.date_collected).sort();
          const uniqueDates = new Set(visitDates);
          const setDates = [...uniqueDates];
          setStartDate(parseISO(setDates[setDates.length - 1]));
          setEndDate(parseISO(setDates[setDates.length - 1]));
          setVisited(setDates);
        });
      api.getFarmById(selectedFarms[0].id, source)
        .then((data) => { setDataFromFarm(data); });
    }
    return () => {
      isMounted = false;
      source.cancel('axios request cancelled');
    };
  }, [selectedFarms]);

  // *** VARIETIES ***
  const [varieties, setVarieties] = useState([]);
  useMemo(() => {
    if (!selectedFarms[0] || selectedFarms.length === 0) return setVarieties([]);

    const toFilter = {
      blocks: selectedBlocksFarms,
      ages: selectedAgesFarms,
      spacings: selectedSpacingsFarms,
    };

    const finalFilterdVariety = filteringModal(toFilter, dataFromFarm);

    const varietyData = formatModal.varieties(finalFilterdVariety);

    return setVarieties(varietyData);
  }, [
    dataFromFarm,
    selectedAgesFarms,
    selectedBlocksFarms,
    selectedSpacingsFarms,
  ]);

  // *** SPACINGS ***
  const [spacings, setSpacing] = useState([]);
  useMemo(() => {
    if (!selectedFarms[0] || selectedFarms.length === 0) return setSpacing([]);

    const toFilter = {
      varieties: selectedVarietiesFarms,
      blocks: selectedBlocksFarms,
      ages: selectedAgesFarms,
    };

    const filteredFinalSpacing = filteringModal(toFilter, dataFromFarm);

    const spacing = formatModal.spacing(filteredFinalSpacing);

    return setSpacing(spacing);
  }, [
    dataFromFarm,
    selectedVarietiesFarms,
    selectedAgesFarms,
    selectedBlocksFarms,
  ]);

  // *** AGES ***
  const [ages, setAges] = useState([]);
  useMemo(() => {
    if (!selectedFarms[0] || selectedFarms.length === 0) return setAges([]);

    const toFilter = {
      varieties: selectedVarietiesFarms,
      blocks: selectedBlocksFarms,
      spacings: selectedSpacingsFarms,
    };

    const filteredFinalAge = filteringModal(toFilter, dataFromFarm);

    const ageData = formatModal.age(filteredFinalAge, 'name');

    return setAges(ageData);
  }, [
    dataFromFarm,
    selectedBlocksFarms,
    selectedVarietiesFarms,
    selectedSpacingsFarms,
  ]);

  // *** GRAFTS ***
  const [grafts, setGrafts] = useState([]);
  useMemo(() => {
    if (!selectedFarms[0] || selectedFarms.length === 0) return setGrafts([]);

    const graft = formatModal.grafts(dataFromFarm);

    return setGrafts(graft);
  }, [dataFromFarm]);

  // *** BLOCKS ***
  const [blocks, setBlocks] = useState([]);
  useMemo(() => {
    if (!selectedFarms[0] || selectedFarms.length === 0) return setBlocks([]);

    const toFilter = {
      varieties: selectedVarietiesFarms,
      ages: selectedAgesFarms,
      spacings: selectedSpacingsFarms,
    };

    const filteredFinal = filteringModal(toFilter, dataFromFarm);

    const block = formatModal.block(filteredFinal);

    return setBlocks(block);
  }, [
    dataFromFarm,
    selectedVarietiesFarms,
    selectedSpacingsFarms,
    selectedAgesFarms,
  ]);

  function handleClearFilters() {
    setNameReport('');
    setSelectedReport('');
    setSelectedFarms([]);
    setSelectedBlocksFarms([]);
    setSelectedSpacingsFarms([]);
    setSelectedVarietiesFarms([]);
    setSelectedGraftsFarms([]);
    setSelectedAgesFarms([]);
    setFarms([]);
    setSpacing([]);
    setVarieties([]);
    setGrafts([]);
    setAges([]);
    setOpen(false);
  }

  function handleClose() {
    handleClearFilters();
    setCreateReportModalVisibility(false);
  }

  async function handleSubmit() {
    try {
      setLoadingHere(true);
      clearHeatmaps();
      setChartsSelected([]);
      setSelectedMap(false);

      const id = Math.floor(Math.random() * 1000);

      const resp = {
        name: nameReport === '' ? `report ${id}` : nameReport,
        farm: selectedFarms,
        varieties: dispensableKeys(selectedVarietiesFarms),
        grafts: dispensableKeys(selectedGraftsFarms),
        ages: dispensableKeys(selectedAgesFarms),
        spacing: dispensableKeys(selectedSpacingsFarms),
        blocks: dispensableKeys(selectedBlocksFarms),
        period: [
          format(period.startDate, 'yyyy-MM-dd'),
          format(period.endDate, 'yyyy-MM-dd'),
        ],
      };

      const idSaved = await apiReports.postSaveReport(resp);
      const repSaved = await apiReports.getOneReport(idSaved);
      const repSavedDate = {
        ...repSaved,
        period: [
          repSaved.period[0],
          repSaved.period[1],
          formatEndDate(repSaved.period[1]),
        ],
      };

      storage.update('report', repSaved);

      setParams({ redirect: true, value: repSavedDate });
      navigate(`/report/${repSaved.report_id}`);

      handleClose();
    } catch (error) {
      getValidationErrors(error);
    } finally {
      if (loadingHere) {
        setLoadingHere(false);
      }
    }
  }

  function handleReportSelect(value) {
    if (value === 'Nenhum') {
      handleClearFilters();

      return false;
    }

    const foundReport = reports.find((report) => report.name === value);

    if (!foundReport) {
      return false;
    }

    setSelectedReport(value);
    setSelectedFarms(foundReport.farm);
    setSelectedBlocksFarms(foundReport.blocks);
    setSelectedSpacingsFarms(foundReport.spacing);
    setSelectedVarietiesFarms(foundReport.varieties);
    setSelectedGraftsFarms(foundReport.grafts);
    setSelectedAgesFarms(foundReport.ages);
    return true;
  }

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      setLoadingHere(false);
      handleClearFilters();
    }
    return () => { isMounted = false; };
  }, []);

  return (
    <Modal
      visible={createReportModalVisibility}
      onSubmit={() => handleSubmit()}
      onClose={() => {
        handleClose();
        handleDetectMobile();
      }}
      disabled={selectedBlocksFarms.length === 0 || loadingHere}
      loading={loadingHere}
    >
      <TextField
        value={nameReport}
        onChange={(e) => setNameReport(e.target.value)}
        label="Nome do relatório"
        variant="outlined"
        color="primary"
        required
        fullWidth
      />

      <ReportDataBox>
        <InputContainer>
          <Box>
            <div>
              <Content>
                <AutocompleteInput
                  label="Fazenda"
                  width="100%"
                  options={farms}
                  loading={farms.length === 0}
                  disabled={
                    (selectedFarms.length === 1 && selectedFarms[0] !== undefined)
                    || farms.length === 0
                  }
                  selectedOptions={selectedFarms}
                  setSelectedOptions={setSelectedFarms}
                />
                <AutocompleteInput
                  label="Variedade"
                  width="100%"
                  options={varieties}
                  loading={selectedFarms.length !== 0 && varieties.length === 0}
                  disabled={selectedFarms.length === 0 || varieties.length === 0}
                  selectedOptions={selectedVarietiesFarms}
                  setSelectedOptions={setSelectedVarietiesFarms}
                />
                {open && (
                  <AutocompleteInput
                    label="Espaçamento"
                    width="100%"
                    options={spacings}
                    loading={selectedFarms.length !== 0 && varieties.length === 0}
                    disabled={
                      selectedFarms.length === 0 || spacings.length === 0 || varieties.length === 0
                    }
                    selectedOptions={selectedSpacingsFarms}
                    setSelectedOptions={setSelectedSpacingsFarms}
                  />
                )}
                {open && (
                  <AutocompleteInput
                    label="Idade"
                    width="100%"
                    options={ages}
                    loading={selectedFarms.length !== 0 && ages.length === 0}
                    disabled={selectedFarms.length === 0 || ages.length === 0
                      || varieties.length === 0}
                    selectedOptions={selectedAgesFarms}
                    setSelectedOptions={setSelectedAgesFarms}
                  />
                )}
                {open && (
                  <AutocompleteInput
                    label="Enxerto"
                    width="100%"
                    options={grafts}
                    loading={selectedFarms.length !== 0 && varieties.length === 0
                      && grafts.length === 0}
                    disabled={selectedFarms.length === 0 || grafts.length === 0
                      || varieties.length === 0}
                    selectedOptions={selectedGraftsFarms}
                    setSelectedOptions={setSelectedGraftsFarms}
                  />
                )}
                <AutocompleteInput
                  label="Quadra"
                  width="100%"
                  options={blocks}
                  loading={selectedFarms.length !== 0 && blocks.length === 0
                    && varieties.length === 0}
                  disabled={selectedFarms.length === 0 || blocks.length === 0
                    || varieties.length === 0}
                  selectedOptions={selectedBlocksFarms}
                  setSelectedOptions={setSelectedBlocksFarms}
                />
                {!open && (
                  <ButtonFilter
                    onClick={() => setOpen((e) => !e)}
                  >
                    <MoreHoriz />
                  </ButtonFilter>
                )}
              </Content>
              {open && (
                <ButtonFilter
                  onClick={() => setOpen((e) => !e)}
                >
                  <KeyboardReturn />
                </ButtonFilter>
              )}
            </div>
          </Box>
        </InputContainer>

        <CopyForm>
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">
              Copiar de
            </InputLabel>

            <Select
              native
              value={selectedReport}
              onChange={(e) => handleReportSelect(e.target.value)}
              label="Copiar de"
              inputProps={{
                name: 'copiar de',
                id: 'outlined-age-native-simple',
              }}
            >
              <option value="Nenhum">Nenhum</option>
              {reports.map((report) => (
                <option key={report.report_id + 1} value={report.name}>
                  {report.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <DatePicker
            loading={selectedFarms.length === 1 && ages.length !== 0
              && selectedBlocksFarms.length !== 0}
            disabledCustom={selectedBlocksFarms.length === 0}
          />
        </CopyForm>
      </ReportDataBox>

      <Box>
        <Typography component="span">Filtros adicionados</Typography>

        <Box sx={{ mt: 2 }}>
          {selectedFarms[0] !== undefined && selectedFarms.map((farm) => (
            <Chip
              key={farm.id}
              label={farm.name}
              onDelete={() => {
                setSelectedFarms((prevState) => prevState.filter(
                  (selected) => selected.id !== farm.id,
                ));
                handleClearFilters();
              }}
              deleteIcon={<Cancel style={{ color: '#FA376C' }} />}
              style={{
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: '#FAE3E9',
                color: '#FA376C',
              }}
            />
          ))}

          {selectedVarietiesFarms.map((variety) => (
            <Chip
              key={variety.id}
              label={variety.name}
              style={{
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: '#FAEBE4',
                color: '#FA7C44',
              }}
            />
          ))}

          {selectedSpacingsFarms.map((spacing) => (
            <Chip
              key={spacing.name}
              label={spacing.name}
              style={{
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: '#EFF9F3',
                color: '#307C53',
              }}
            />
          ))}

          {sortedSelectedAges.map((age) => (
            <Chip
              key={age.name}
              label={age.name}
              style={{
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: '#FAF8E0',
                color: '#A9A13D',
              }}
            />
          ))}

          {selectedGraftsFarms.map((graftVariety) => (
            <Chip
              key={graftVariety.name}
              label={graftVariety.name}
              style={{
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: 'rgba(43, 73, 118,0.12)',
                color: '#2B4976',
              }}
            />
          ))}

          {sortedSelectedBlocks.map((block) => (
            <Chip
              key={block.id}
              label={block.name}
              style={{
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: 'rgba(165, 201, 234,0.22)',
                color: '#3F80BC',
              }}
            />
          ))}

        </Box>
      </Box>
    </Modal>
  );
}
