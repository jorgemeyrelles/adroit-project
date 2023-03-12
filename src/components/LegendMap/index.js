import React from 'react';
import PropTypes from 'prop-types';
import {
  filtersBlueRed, filtersCyan, filtersFruit, filtersViridisLighter,
} from '../../constants';
import { lastClickedHeatmap } from '../../utils/format';
import {
  GradientCividis, GradientCyanYellow,
  GradientDiv, GradientViridisLighter,
  Scale, ScaleCyan, TextLeg,
} from './style';

export function LegendMap(props) {
  const { selectedFilters, heatmap } = props;

  return (
    <GradientDiv>
      {filtersFruit.includes(lastClickedHeatmap(selectedFilters, heatmap).key.split('-')[0])
        && (
          <div>
            <TextLeg>
              {`${lastClickedHeatmap(selectedFilters, heatmap).key.split('-')[0]} (Un)`}
            </TextLeg>
            <GradientViridisLighter />
            <Scale>
              {lastClickedHeatmap(selectedFilters, heatmap).scale
                .map((e) => <p key={`count-${e}`}>{e}</p>)}
            </Scale>
          </div>
        )}
      {filtersBlueRed.includes(lastClickedHeatmap(selectedFilters, heatmap).key.split('-')[0])
        && (
          <div>
            <TextLeg>
              {`${lastClickedHeatmap(selectedFilters, heatmap).key.split('-')[0]} (m3)`}
            </TextLeg>
            <GradientCividis />
            <Scale>
              {lastClickedHeatmap(selectedFilters, heatmap).scale
                .map((e) => <p key={`blueRed-${e}`}>{e}</p>)}
            </Scale>
          </div>
        )}
      {filtersViridisLighter.includes(lastClickedHeatmap(selectedFilters, heatmap).key.split('-')[0])
        && (
          <div>
            <TextLeg>
              {`${lastClickedHeatmap(selectedFilters, heatmap).key.split('-')[0]} (Un)`}
            </TextLeg>
            <GradientViridisLighter />
            <Scale>
              {lastClickedHeatmap(selectedFilters, heatmap).scale
                .map((e) => <p key={`light-${e}`}>{e}</p>)}
            </Scale>
          </div>
        )}
      {filtersCyan.includes(lastClickedHeatmap(selectedFilters, heatmap).key.split('-')[0])
        && (
          <div>
            <TextLeg>
              {`${lastClickedHeatmap(selectedFilters, heatmap).key.split('-')[0]} (Existe)`}
            </TextLeg>
            <GradientCyanYellow />
            <ScaleCyan>
              {lastClickedHeatmap(selectedFilters, heatmap).scale
                .map((e) => <p key={`noWeight-${e}`}>{e}</p>)}
            </ScaleCyan>
          </div>
        )}
    </GradientDiv>
  );
}

LegendMap.propTypes = {
  props: PropTypes.node,
}.isRequired;
