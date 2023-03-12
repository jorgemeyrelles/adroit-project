import React, { useContext, useMemo, useState } from 'react';
import { useParams } from 'react-router';

import { chartsNames } from '../../constants';
import { ChartContext } from '../../context/ChartContext';
import { MapContext } from '../../context/MapContext';

import { ChartButton } from '../Touchables/ChartButton';
import { Container } from './styles';

export function Sidebar() {
  const {
    data, isLoading, chartsSelected, setChartsSelected,
  } = useContext(ChartContext);
  const { setSelectedMap, propArr, renderCenter } = useContext(MapContext);

  const [dataTo, setDataTo] = useState({});

  const report = localStorage.getItem('report');
  const local = localStorage.getItem('reportId');
  const { id } = useParams();

  function handleChartSelect(chartName) {
    const arr = chartsSelected;
    if (arr.includes('Mapa') && chartName === 'Mapa') {
      setSelectedMap(false);
    } else if (!arr.includes('Mapa') && chartName === 'Mapa') {
      setSelectedMap(true);
    }
    setChartsSelected((prevState) => (prevState.find((item) => item === chartName)
      ? prevState.filter((item) => item !== chartName)
      : [...prevState, chartName]));
  }

  useMemo(() => {
    if (local) {
      setDataTo(JSON.parse(local));
    }
  }, [local]);

  const navChartsItems = useMemo(
    () => chartsNames.map((chartName) => {
      const chart = data[chartName.id];

      switch (chartName.id) {
        case 2:
          return {
            icon_active: '/assets/table_white.svg',
            icon: '/assets/table_blue.svg',
            ...chartName,
            loading: isLoading.table,
            disabled: isLoading.table || chart?.data.length === 0,
          };
        case 3:
          return {
            ...chartName,
            icon_active: '/assets/doughnut_chart_white.svg',
            icon: '/assets/doughnut_chart_blue.svg',
            loading: isLoading.ripening,
            disabled: isLoading.ripening || chart?.data.length === 0,
          };
        case 4:
          return {
            ...chartName,
            icon_active: '/assets/bar_chart_white.svg',
            icon: '/assets/bar_chart_blue.svg',
            loading: isLoading.diameter,
            disabled: isLoading.diameter || (chart?.data || [])
              .every((item) => item.data.datasets
                .every((i) => i.length === 0)),
          };
        case 5:
          return {
            ...chartName,
            icon_active: '/assets/bar_chart_white.svg',
            icon: '/assets/bar_chart_blue.svg',
            loading: isLoading.treeHeight,
            disabled: isLoading.treeHeight || (chart?.data || [])
              .every((item) => item.data.datasets
                .every((i) => i.length === 0)),
          };
        case 6:
          return {
            ...chartName,
            icon_active: '/assets/bar_chart_white.svg',
            icon: '/assets/bar_chart_blue.svg',
            loading: isLoading.onGround,
            disabled: isLoading.onGround || (chart?.data || [])
              .every((item) => item.data.datasets
                .every((i) => i.length === 0)),
          };
        case 8:
          return {
            ...chartName,
            icon_active: '/assets/bar_chart_white.svg',
            icon: '/assets/bar_chart_blue.svg',
            loading: isLoading.flower,
            disabled: isLoading.flower || (chart?.data || []).every((item) => item.data.datasets
              .every((i) => i.length === 0)),
          };
        case 9:
          return {
            ...chartName,
            icon_active: '/assets/bar_chart_white.svg',
            icon: '/assets/bar_chart_blue.svg',
            loading: isLoading.inventory,
            disabled: isLoading.inventory || (chart?.data || []).every((item) => item.data.datasets
              .every((i) => i.length === 0)),
          };
        case 10:
          return {
            ...chartName,
            icon_active: '/assets/bar_chart_white.svg',
            icon: '/assets/bar_chart_blue.svg',
            loading: isLoading.anomaly,
            disabled: isLoading.anomaly || (chart?.data || []).every((item) => item.data.datasets
              .every((i) => i.length === 0)),
          };
        default:
          return {
            ...chartName,
            icon_active: '/assets/bar_chart_white.svg',
            icon: '/assets/bar_chart_blue.svg',
            loading: false,
            disabled: isLoading || chart?.data.length === 0,
          };
      }
    }),
    [
      data,
      dataTo,
      id,
      local,
      report,
    ],
  );

  return (
    <Container>
      {navChartsItems.map((chartName) => (chartName.id === 1 ? (
        <div key={`div-${chartName.id}`} style={{ position: 'relative' }}>
          <ChartButton
            type="button"
            key={chartName.id}
            onClick={() => {
              handleChartSelect(chartName.name);
            }}
            selected={chartsSelected.includes(chartName.name)}
            loading={(propArr.length < 9 || renderCenter)}
            disabled={(propArr.length < 9 || renderCenter)}
            iconActive="/assets/pin_map_white.svg"
            icon="/assets/pin_map_blue.svg"
          >
            {chartName.name}
          </ChartButton>
        </div>
      ) : (
        <div key={`div-${chartName.id}`}>
          <ChartButton
            type="button"
            key={chartName.id}
            valueKey={chartName.id}
            onClick={() => {
              handleChartSelect(chartName.name);
            }}
            selected={chartsSelected.includes(chartName.name)}
            loading={chartName.loading}
            disabled={chartName.disabled}
            iconActive={chartName.icon_active}
            icon={chartName.icon}
          >
            {chartName.name}
          </ChartButton>
        </div>
      )))}
    </Container>
  );
}
