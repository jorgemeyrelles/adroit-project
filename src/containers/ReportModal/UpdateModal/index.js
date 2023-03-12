import React, {
  useMemo,
  useState,
  useContext,
  useEffect,
} from 'react';

import { format, parseISO } from 'date-fns';

import { useNavigate } from 'react-router';
import {
  Box, Chip, TextField, Typography,
} from '@mui/material';
import axios from 'axios';
import { MoreHoriz, KeyboardReturn } from '@mui/icons-material';
import { AutocompleteInput } from '../../../components/Form/Autocomplete';
import { Modal } from '../../../components/Modal';
import {
  removeDuplicateObjects,
  formatDifference,
  formatModal,
  filteringModal,
  dispensableKeys,
  formatEndDate,
} from '../../../utils/format';

import {
  ButtonFilter, Content, CopyForm, InputContainer, ReportDataBox,
} from '../styles';
import { StateGlobal } from '../../../context/StateGlobal';
import { api } from '../../../service/api';
import { ChartContext } from '../../../context/ChartContext';
import { DatePicker } from '../../../components/DatePicker';
import { getOne, updateOneReport } from '../../../service/apiReports';
import { MapContext } from '../../../context/MapContext';
import { getValidationErrors, isExpiredToken } from '../../../utils/getValidationErrors';

import { storage } from '../../../utils/hooks/useLocalStorage';

export function UpdateModal() {
  const navigate = useNavigate();

  const [name, setName] = useState('');

  const [selectedFarms, setSelectedFarms] = useState([]);
  const [selectedVarietiesFarms, setSelectedVarietiesFarms] = useState([]);
  const [selectedSpacingsFarms, setSelectedSpacingsFarms] = useState([]);
  const [selectedAgesFarms, setSelectedAgesFarms] = useState([]);
  const [selectedGraftsFarms, setSelectedGraftsFarms] = useState([]);
  const [selectedBlocksFarms, setSelectedBlocksFarms] = useState([]);

  const [loadingHere, setLoadingHere] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    createReportModalVisibility,
    setCreateReportModalVisibility,
    period,
    setEndDate,
    setStartDate,
    update,
    setUpdate,
    setVisited,
    currentReport,
    setCurrentReport,
    setCustom,
  } = useContext(StateGlobal);

  const {
    setParams,
    setChartsSelected,
  } = useContext(ChartContext);
  const { clearHeatmaps, setSelectedMap } = useContext(MapContext);

  const [dataFromFarm, setDataFromFarm] = useState([]);
  const [open, setOpen] = useState(false);

  const token = storage.get('token');

  useEffect(() => {
    if (currentReport !== undefined) {
      setStartDate(parseISO(currentReport.period[0]));
      setEndDate(parseISO(currentReport.period[1]));
    }
  }, [currentReport]);

  useEffect(() => {
    setTimeout(() => {
      setCustom(isLoading !== true);
    }, 0);

    return () => setCustom(false);
  }, [isLoading]);

  const sortedSelectedBlocks = selectedBlocksFarms.sort((a, b) => a.name - b.name);
  const sortedSelectedAges = selectedAgesFarms.sort((a, b) => a.id - b.id);

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
      setIsLoading(true);
      api.getBlocksByFarmId(selectedFarms[0].id, source)
        .then((data) => {
          const visitDates = data.map((date) => date.date_collected).sort();
          const uniqueDates = new Set(visitDates);
          setVisited([...uniqueDates]);
        });
      api.getFarmById(selectedFarms[0].id, source)
        .then((data) => setDataFromFarm(data));
    }
    setIsLoading(false);
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

  function handleClose() {
    setUpdate({ loading: false, data: [] });
    setCreateReportModalVisibility(false);
  }

  async function handleSubmit(value) {
    try {
      setLoadingHere(true);
      clearHeatmaps();
      setChartsSelected([]);
      setSelectedMap(false);
      const selected = reports.find((report) => report.report_id === value);

      const resp = {
        name: name === '' ? `report ${selected.report_id}` : name,
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

      // updating DB
      await updateOneReport(token, selected.report_id, resp);
      const repUpdated = await getOne(token, selected.report_id);

      const repUpdatedDate = {
        ...repUpdated,
        period: [
          repUpdated.period[0],
          repUpdated.period[1],
          formatEndDate(repUpdated.period[1]),
        ],
      };

      const fromLocal = JSON.parse(localStorage.getItem('report'));
      const withNoReport = fromLocal.filter((e) => e.report_id !== selected.report_id);

      if (fromLocal) {
        withNoReport.unshift(repUpdated);
        localStorage.setItem('report', JSON.stringify(withNoReport));
      } else {
        localStorage.setItem('report', JSON.stringify([repUpdated]));
      }

      setParams({ redirect: true, value: repUpdatedDate });
      navigate(`/report/${repUpdated.report_id}`);

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
    const foundReport = reports.find((report) => report.report_id === value);
    setCurrentReport(foundReport);
    if (!foundReport) {
      return false;
    }

    const getAges = async () => {
      const data = dataFromFarm;
      const allVisits = [];
      const ageData = data.filter((block) => block.visit_date !== null)
        .map((block) => {
          const today = block.plating_date !== null
            ? new Date(block.plating_date) : new Date(block.visit_date);
          const last = block.plating_date !== null
            ? new Date(block.visit_date) : new Date();
          const difference = formatDifference(
            today,
            last,
          );
          allVisits.push({ block: block.cod_block, dateVisit: block.visit_date });

          return {
            id: Number(difference),
            name: `${String(difference)} anos`,
          };
        });

      return setAges(removeDuplicateObjects(ageData));
    };

    if (foundReport) {
      getAges();
    }

    setName(foundReport.name);
    setSelectedFarms(foundReport.farm);
    setSelectedVarietiesFarms(foundReport.varieties);
    setSelectedSpacingsFarms(foundReport.spacing);
    setSelectedAgesFarms(foundReport.ages);
    setSelectedGraftsFarms(foundReport.grafts);
    setSelectedBlocksFarms(foundReport.blocks);
    setStartDate(foundReport.period[0]);
    setEndDate(foundReport.period[1]);
    return true;
  }

  const { loading, data } = update;

  useEffect(() => {
    setLoadingHere(false);
    handleReportSelect(data);
  }, [loading]);

  return (
    <Modal
      visible={loading}
      onSubmit={() => handleSubmit(data)}
      onClose={() => handleClose()}
      disabled={selectedBlocksFarms.length === 0 || loadingHere}
      loading={loadingHere}
    >
      <TextField
        label="Apelido do report"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
        value={name}
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
          <DatePicker
            loading={
              selectedFarms.length === 1
              && (selectedAgesFarms.length !== 0
                || ages.length !== 0)
            }
            disabledCustom={
              selectedFarms.length === 0
              || blocks.length === 0
              || varieties.length === 0
            }
          />
        </CopyForm>
      </ReportDataBox>

      <Box sx={{ mt: '40px' }}>
        <Typography>Filtros adicionados</Typography>

        <Box marginTop="10px">
          {selectedFarms.map((farm) => (
            <Chip
              disabled
              key={farm.id}
              label={farm.name}
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
