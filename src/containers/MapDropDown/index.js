import React, {
  useMemo,
  useContext,
} from 'react';

import PropTypes from 'prop-types';

import { MapContext } from '../../context/MapContext';

import { DropDown } from '../../components/DropDown';
import { DropDownButton } from '../../components/Touchables/DropDownButton';
import { CountFruitDropDown } from './CountFruitDropDown';

import {
  ButtonsArea,
  ClearButton, Footer, Subtitle, Title,
} from './styles';

export function MapDropDown({ button: Button }) {
  const {
    countFruitsHeatmaps,
    heatmaps,
    geotiffs,
    selectHeatmap,
    clearHeatmaps,
    isDropdownVisible,
    handleVisibilityToggle,
    selectedMap,
  } = useContext(MapContext);

  const disableCountFruitsDropDown = useMemo(
    () => countFruitsHeatmaps.every((item) => item.disabled),
    [countFruitsHeatmaps],
  );

  return (
    <DropDown button={Button} isSelected={selectedMap}>
      <Title>Mapa</Title>
      <Subtitle>Selecione o que você deseja exibir.</Subtitle>

      <ButtonsArea>
        <CountFruitDropDown
          data={{
            name: 'Contagem',
            disabled: disableCountFruitsDropDown,
          }}
          isDropdownVisible={isDropdownVisible}
          handleVisibilityToggle={handleVisibilityToggle}
        >
          {countFruitsHeatmaps.map((heatmap, index) => (
            <DropDownButton
              key={`${heatmap.name}-${index + 1}`}
              onClick={() => {
                selectHeatmap(heatmap.name);
              }}
              loading={heatmap.loading}
              selected={heatmap.selected}
              disabled={(!selectedMap ? true : heatmap.disabled)}
              selectedMap={selectedMap}
            >
              {heatmap.name}
            </DropDownButton>
          ))}
        </CountFruitDropDown>

        {geotiffs.map((heatmap, index) => (
          <DropDownButton
            key={`${heatmap.name}-${index + 1}`}
            onClick={() => {
              selectHeatmap(heatmap.name);
            }}
            loading={heatmap.loading}
            selected={heatmap.selected}
            disabled={(!selectedMap ? true : !heatmap.disabled) || heatmap.data[0]?.block === ''}
            selectedMap={selectedMap}
          >
            {heatmap.name}
          </DropDownButton>
        ))}

        {heatmaps.map((heatmap, index) => (
          <DropDownButton
            key={`${heatmap.name}-${index + 1}`}
            onClick={() => {
              selectHeatmap(heatmap.name);
            }}
            loading={heatmap.loading}
            selected={heatmap.selected}
            disabled={(!selectedMap ? true : !heatmap.disabled) || heatmap.data[0].id === ''}
            selectedMap={selectedMap}
          >
            {heatmap.name}
          </DropDownButton>
        ))}
      </ButtonsArea>

      <Footer>
        <ClearButton
          type="button"
          onClick={clearHeatmaps}
        >
          Limpar seleção
        </ClearButton>
      </Footer>
    </DropDown>
  );
}

MapDropDown.propTypes = {
  Button: PropTypes.node,
}.isRequired;
