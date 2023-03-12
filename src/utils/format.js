import {
  format, subMonths, differenceInYears, addDays,
} from 'date-fns';
import {
  classId,
  colors,
  filterBlueYellow,
  filterDefault,
  filtersBlueRed,
  filtersCyan,
  filtersFruit,
  filtersRedToGreen,
  filtersViridisLighter,
} from '../constants';

import { gradientsColors } from './colors';

export const dispensableKeys = (selected) => selected
  .map((e) => ({ id: e.id, name: e.name })) || [];

export function formatEndDate(endDate) {
  const dt = new Date(endDate.replace(/-/g, '/'));

  const end = addDays(dt, 1);

  const secDate = format(end, 'yyyy-MM-dd');
  return secDate;
}

export const startOrEndVisited = (sit, visited) => {
  const filterDate = visited;

  const dateInterditesRaw = filterDate.map((e) => {
    const visitedType = new Date(e.dateVisit);
    return new Date(visitedType.getFullYear(), visitedType.getMonth(), (visitedType.getDate() + 1));
  });

  if (sit === 'end') {
    return dateInterditesRaw.sort((a, b) => b - a)[0];
  }

  return dateInterditesRaw.sort((a, b) => b - a)[dateInterditesRaw.length - 1];
};

const formatVisited = (visited) => {
  const filterDate = visited;

  const dateInterditesRaw = filterDate.map((e) => {
    const visitedType = new Date(e.dateVisit);
    return new Date(visitedType.getFullYear(), visitedType.getMonth(), (visitedType.getDate() + 1));
  });

  return dateInterditesRaw;
};

export const visitedDate = {
  start: (visited) => {
    const dateInterditesRaw = formatVisited(visited);

    return dateInterditesRaw.sort((a, b) => b - a)[dateInterditesRaw.length - 1];
  },
  end: (visited) => {
    const dateInterditesRaw = formatVisited(visited);

    return dateInterditesRaw.sort((a, b) => b - a)[0];
  },
};

export function formatDate(date = new Date()) {
  const adjust = addDays(date, 1);
  return format(adjust, 'dd/MM/yyyy');
}

export function formatDifference(startDate = new Date(), endDate = new Date()) {
  return differenceInYears(endDate, startDate);
}

export function subtractMonths(date = new Date(), amount = 1) {
  return subMonths(date, amount);
}

export function removeDuplicateObjects(array, key) {
  const withNoRepeted = [];
  array.map((e) => {
    if (withNoRepeted.length === 0 || withNoRepeted.every((i) => i[key] !== e[key])) {
      return withNoRepeted.push(e);
    }
    return false;
  }).filter((each) => each !== false);
  if (withNoRepeted.length === 1 && withNoRepeted[0].id === null) {
    return [];
  }
  return withNoRepeted;
}

export function removeNullableObjects(array, key) {
  return array.filter((item) => item[key] !== null);
}

export function convertDataToGoogleMVCArray(coordinatesWithWeight = []) {
  return coordinatesWithWeight.map((coord) => {
    const ret = {
      location: new window.google.maps.LatLng(coord.latitude, coord.longitude),
      weight: coord.weight,
    };
    return ret;
  });
}

export function calculateCentralGeoCoordinate(
  coordinates,
) {
  const rad2degr = (rad) => (rad * 180) / Math.PI;
  const degr2rad = (degr) => (degr * Math.PI) / 180;

  const newCoordinates = coordinates.filter(
    (coord) => coord.latitude !== 0 || coord.longitude !== 0,
  );

  let sumX = 0;
  let sumY = 0;
  let sumZ = 0;

  newCoordinates.forEach((dot) => {
    const latitude = degr2rad(dot.latitude);
    const longitude = degr2rad(dot.longitude);

    sumX += Math.cos(latitude) * Math.cos(longitude);
    sumY += Math.cos(latitude) * Math.sin(longitude);
    sumZ += Math.sin(latitude);
  });

  const avgX = sumX / newCoordinates.length;
  const avgY = sumY / newCoordinates.length;
  const avgZ = sumZ / newCoordinates.length;

  const lng = Math.atan2(avgY, avgX);
  const hyp = Math.sqrt(avgX * avgX + avgY * avgY);
  const lat = Math.atan2(avgZ, hyp);
  return {
    lat: rad2degr(lat),
    lng: rad2degr(lng),
  };
}

export function calculateQuatile(data = [], percentile = 0.95) {
  const sortedData = data.sort((itemA, itemB) => itemA - itemB);
  const selectedIndex = percentile * (sortedData.length - 1);

  if (sortedData[Math.floor(selectedIndex) + 1] !== undefined) {
    return (
      sortedData[Math.floor(selectedIndex)] + ((selectedIndex - Math.floor(selectedIndex))
        * (sortedData[Math.floor(selectedIndex) + 1] - sortedData[Math.floor(selectedIndex)]))
    );
  }

  return sortedData[selectedIndex];
}

function minMax2DArray(arr) {
  const res = arr.reduce(
    ([min2, max2], val) => [Math.min(min2, val.weight), Math.max(max2, val.weight)],
    [
      Number.POSITIVE_INFINITY,
      Number.NEGATIVE_INFINITY,
    ],
  );
  return { max: Number(res[1].toFixed(2)), min: Number(res[0].toFixed(2)) };
}

const maxAndMinWeight = (array, type) => {
  // filtersCyan -> noWeight
  if (filtersCyan.includes(type)) {
    return [0, 1];
  }
  const aux = minMax2DArray(array.data);
  const maxWeight = aux.max;
  const minWeight = aux.min;
  const middleWeight = minWeight + ((maxWeight - minWeight) / 2);
  const majorQuater = (middleWeight + (maxWeight - middleWeight) / 2);
  const minQuarter = (minWeight + (middleWeight - minWeight) / 2);
  return ([
    minWeight < 0 ? 0 : minWeight,
    Number(minQuarter.toFixed(2)),
    middleWeight,
    Number(majorQuater.toFixed(2)),
    Math.round(maxWeight),
  ]);
};

export function formatHeatmap(array, fruitArray) {
  const toHeatmap = array
    .concat(fruitArray)
    .filter((item) => item.data.length > 0)
    .filter((item) => item.selected)
    .map((item, index) => {
      const key = `${item.name}-${index}`;
      const data = convertDataToGoogleMVCArray(item.data);

      const maxIntensity = calculateQuatile(
        item.data.map((i) => i.weight),
      );

      let selectedGradient = null;

      if (filtersBlueRed.includes(key.split('-')[0])) {
        selectedGradient = gradientsColors.blueRed;
      } else if (filtersViridisLighter.includes(key.split('-')[0])) {
        selectedGradient = gradientsColors.viridisLighter;
      } else if (filtersFruit.includes(key.split('-')[0])) {
        selectedGradient = gradientsColors.viridisLighter;
      } else if (filtersCyan.includes(key.split('-')[0])) {
        selectedGradient = gradientsColors.cyanYellow;
      } else if (filtersRedToGreen.includes(key.split('-')[0])) {
        selectedGradient = gradientsColors.redToGreen;
      } else if (filterBlueYellow.includes(key.split('-')[0])) {
        selectedGradient = gradientsColors.cividis;
      } else if (filterDefault.includes(key.split('-')[0])) {
        selectedGradient = gradientsColors.default;
      }

      const scale = maxAndMinWeight(item, item.name);

      return {
        key,
        data,
        gradient: selectedGradient,
        maxIntensity,
        scale,
      };
    });
  return toHeatmap;
}

export const filterHeat = (array, filter) => {
  if (filter !== '') {
    return array.filter((type) => type.key.split('-')[0] === filter);
  }
  return [{
    key: '1',
    data: [],
    gradient: [],
    maxIntensity: 0,
  }];
};

export function returnFruitsResponse(array, value) {
  let verify = '';
  const ret = array.map((eachValue) => {
    const blockName = value.blocks.filter((bl) => Number(bl.id) === Number(eachValue.blockId))[0];
    if (Number(verify) !== Number(eachValue.blockId)) {
      const res = {
        variables: {
          reportId: value.report_id,
          startDate: value.period[0],
          endDate: value.period[1],
        },
        block: blockName ? blockName.name : eachValue.blockId,
        data: array.map((each) => {
          verify = eachValue.blockId;
          if (eachValue.blockId === each.blockId) {
            return ({
              name: each.nameId,
              total: each.sum,
              percent: each.percent,
            });
          }
          return false;
        }).filter((e) => e !== false),
      };
      return res;
    }
    return false;
  });
  return ret.filter((e) => e !== false).sort((a, b) => a.block - b.block);
}

export function returnRipeningsResponse(array, value) {
  const ret = array.map((e) => {
    const blockName = value.blocks.find((bl) => Number(bl.id) === Number(e.blockId));
    const checkEmpity = (Object.values(e.id));
    const respColor = checkEmpity.map((ind) => colors[ind]);
    return {
      variables: {
        reportId: value.report_id,
        startDate: value.period[0],
        endDate: value.period[1],
      },
      block: blockName || { id: e.blockId, name: '' },
      data: {
        labels: e.nameId,
        datasets: [{
          label: blockName ? blockName.name : e.blockId,
          data: e.percent,
          backgroundColor: respColor,
          colors: respColor,
          borderWidth: 0,
        }],
      },
    };
  });
  return ret.sort((a, b) => a.block.name - b.block.name);
}

export function returnSizeResponse(array, value) {
  let verify = '';
  let highestSize = [];
  array.map((e) => {
    if (e.width3D.length > highestSize.length) {
      highestSize = e.width3D;
      return highestSize;
    }
    return false;
  });

  const ret = array.map((eachValue) => {
    if (Number(verify) !== Number(eachValue.blockId)) {
      const blockName = value.blocks.find((bl) => Number(bl.id) === Number(eachValue.blockId));

      const res = {
        variables: {
          reportId: value.report_id,
          startDate: value.period[0],
          endDate: value.period[1],
        },
        block: blockName || { id: eachValue.blockId, name: '' },
        data: array.map((each) => {
          verify = eachValue.blockId;
          if (eachValue.blockId === each.blockId) {
            return ({
              labels: highestSize,
              datasets: [
                {
                  label: 'Fruta Madura',
                  data: array.map((item) => {
                    if (item.nameId === 'Fruta Madura' && item.blockId === each.blockId) {
                      return item.percent;
                    }
                    return false;
                  }).filter((item) => item !== false)[0],
                  backgroundColor: 'rgba(255, 167, 128, 1)',
                },
                {
                  label: 'Fruta Verde',
                  data: array.map((item) => {
                    if (item.nameId === 'Fruta Verde' && item.blockId === each.blockId) {
                      return item.percent;
                    }
                    return false;
                  }).filter((item) => item !== false)[0],
                  backgroundColor: 'rgba(155, 238, 193, 1)',
                },
                {
                  label: 'Fruta Semi Madura',
                  data: array.map((item) => {
                    if (item.nameId === 'Fruta Semi Madura' && item.blockId === each.blockId) {
                      return item.percent;
                    }
                    return false;
                  }).filter((item) => item !== false)[0],
                  backgroundColor: 'rgba(255, 238, 150, 1)',
                },
              ].filter((vl) => vl.data !== undefined),
            });
          }
          return false;
        }).filter((e) => e !== false && e !== undefined)[0],
      };
      return res;
    }
    return false;
  });

  const refine = ret.filter((i) => i !== false);

  return refine.sort((a, b) => a.block.name - b.block.name);
}

export function returnHeightResponse(array, value) {
  const ret = array.map((e) => {
    const blockName = value.blocks.find((bl) => Number(bl.id) === Number(e.block));
    return {
      variables: {
        reportId: value.report_id,
        startDate: value.period[0],
        endDate: value.period[1],
      },
      block: blockName || { id: e.block, name: '' },
      data: {
        labels: e.labels,
        datasets: [{
          label: 'Ocorrências',
          data: e.count.map((countValue) => ((countValue / e.sum) * 100).toFixed(2)),
          backgroundColor: [
            'rgba(250, 55, 108, 1)',
          ],
        }],
      },
    };
  });
  return ret.sort((a, b) => a.block.name - b.block.name);
}

export function returnGroundResponse(array, value) {
  const toChartOnGround = array.map((obj) => {
    const one = 71;
    const two = 129;
    const three = 180;
    const names = value.blocks.find((blName) => Number(blName.id) === Number(obj.block));

    if (obj.count.length === 0) {
      return false;
    }
    return ({
      variables: {
        reportId: value.report_id,
        startDate: value.period[0],
        endDate: value.period[1],
      },
      block: names || { id: obj.block, name: '' },
      data: {
        labels: obj.labels.sort((a, b) => a - b),
        datasets: [{
          label: names ? names.name : obj.block,
          data: obj.count.map((i) => parseFloat(((i / Number(obj.sum)) * 100).toFixed(2))),
          // data: obj.count.map((i) => i),
          backgroundColor: [
            `rgba(${one}, ${two}, ${three}, 0.2)`,
          ],
          borderColor: [
            `rgba(${one}, ${two}, ${three}, 1)`,
          ],
          borderWidth: 1,
        }],
      },
    });
  }).filter((e) => e !== false);

  return toChartOnGround.sort((a, b) => a.block.name - b.block.name);
}

export function returnInventoryTreesResponse(array, value) {
  const toReplantedChart = array.map((obj) => {
    const names = value.blocks.find((blName) => Number(blName.name) === Number(obj.block));
    if (obj.count.length === 0) {
      return false;
    }
    return ({
      variables: {
        reportId: value.report_id,
        startDate: value.period[0],
        endDate: value.period[1],
      },
      block: names || { id: obj.block, name: '' },
      data: {
        labels: obj.labels,
        datasets: [{
          label: '',
          data: obj.count,
          backgroundColor: [
            'rgba(235, 209, 47, 1)',
            'rgba(145, 184, 18, 1)',
            'rgba(107, 125, 237, 1)',
          ],
          borderWidth: 1,
        }],
        text: obj.productivity,
      },
    });
  }).filter((e) => e !== false);

  return toReplantedChart;
}

export function returnInventoryTreesBarResponse(array, value) {
  let verify = '';
  const toReplantedChart = array.map((eachValue) => {
    if (Number(verify) !== Number(eachValue.block)) {
      const blockName = value.blocks.find((bl) => Number(bl.name) === Number(eachValue.block));

      const res = {
        variables: {
          reportId: value.report_id,
          startDate: value.period[0],
          endDate: value.period[1],
        },
        block: blockName || { id: eachValue.blockId, name: '' },
        data: array.map((each) => {
          verify = eachValue.block;
          if (eachValue.block === each.block) {
            return ({
              labels: '',
              datasets: [
                {
                  label: 'Ausentes',
                  data: array.map((item) => {
                    if (item.labels.includes('Ausentes') && item.block === each.block) {
                      return [item.count[0]];
                    }
                    return false;
                  }).filter((item) => item !== false)[0],
                  backgroundColor: 'rgba(255, 167, 128, 1)',
                },
                {
                  label: 'Mudas',
                  data: array.map((item) => {
                    if (item.labels.includes('Mudas') && item.blockId === each.blockId) {
                      return [item.count[1]];
                    }
                    return false;
                  }).filter((item) => item !== false)[0],
                  backgroundColor: 'rgba(155, 238, 193, 1)',
                },
                {
                  label: 'Secas',
                  data: array.map((item) => {
                    if (item.labels.includes('Secas') && item.block === each.block) {
                      return [item.count[2]];
                    }
                    return false;
                  }).filter((item) => item !== false)[0],
                  backgroundColor: 'rgba(255, 238, 150, 1)',
                },
              ].filter((vl) => vl.data !== undefined),
            });
          }
          return false;
        }).filter((e) => e !== false && e !== undefined)[0],
      };
      return res;
    }
    return false;
  });

  return toReplantedChart;
}

export function returnAnomResponse(array, value) {
  const arraySorted = array.sort((a, b) => a.block - b.block);

  const allBlocks = arraySorted.map((e) => value.blocks
    .map((i) => Number(i.id) === Number(e.block) && i.name)
    .find((o) => o !== false))
    .sort((a, b) => a - b);

  const ret = {
    variables: {
      reportId: value.report_id,
      startDate: value.period[0],
      endDate: value.period[1],
    },
    block: allBlocks.join(', '),
    data: {
      labels: arraySorted[0].labels,
      datasets: arraySorted.map((bl) => {
        const one = Math.floor(Math.random() * 255);
        const two = Math.floor(Math.random() * 255);
        const three = Math.floor(Math.random() * 255);
        const names = value.blocks.filter((blName) => Number(blName.id) === Number(bl.block))[0];
        return {
          label: names ? names.name : bl.block,
          data: bl.count,
          backgroundColor: [
            `rgba(${one}, ${two}, ${three}, 0.2)`,
          ],
          borderColor: [
            `rgba(${one}, ${two}, ${three}, 1)`,
          ],
          borderWidth: 1,
        };
      }).sort((a, b) => a.label - b.label),
    },
  };

  return [ret];
}

export const empty = (valid, objInfo) => ({
  loading: valid,
  data: {
    coords: [{
      id: '',
      weight: '',
      latitude: '',
      longitude: '',
    }],
    variables: {
      reportId: String(objInfo.id),
      startDate: objInfo.startDate,
      endDate: objInfo.endDate,
    },
  },
});

export const emptyFruit = (valid, objInfo) => ({
  loading: valid,
  data: {
    coords: [{
      id: '',
      class: '',
      weight: '',
      latitude: '',
      longitude: '',
    }],
    variables: {
      reportId: String(objInfo.id),
      startDate: objInfo.startDate,
      endDate: objInfo.endDate,
    },
  },
});

export const emptyGeotiff = (valid, objInfo) => ({
  loading: valid,
  data: {
    overlay: [{
      block_id: '',
      url: '',
      bounds: '',
    }],
    variables: {
      reportId: String(objInfo.id),
      startDate: objInfo.startDate,
      endDate: objInfo.endDate,
    },
  },
});

export const emptyBlock = (valid, objInfo) => ({
  loading: valid,
  data: {
    coords: [{
      id: '',
      coords: [],
    }],
    variables: {
      reportId: String(objInfo.id),
    },
  },
});

export const checkCoord = (selectedFilters, proArr) => {
  const allCat = classId.map((e) => e.name);
  const arr = [];

  if (selectedFilters.length === 0) return arr;
  selectedFilters.map((selected) => {
    if (allCat.includes(selected.name)) {
      const fruitArr = proArr.find((images) => Object.keys(images)[0] === 'fruit').fruit;
      const selectedFruitArr = fruitArr.filter((cat) => {
        if (selected.name === 'Fruta Madura') return Object.keys(cat)[0] === 'ripe';
        if (selected.name === 'Fruta Verde') return Object.keys(cat)[0] === 'green';
        if (selected.name === 'Madura Anomalia') return Object.keys(cat)[0] === 'ripeAnomaly';
        if (selected.name === 'Verde Anomalia') return Object.keys(cat)[0] === 'greenAnomaly';
        if (selected.name === 'Fruta Semi Madura') return Object.keys(cat)[0] === 'semiRipe';
        return false;
      }).filter((i) => i !== false);

      return arr.unshift(Object.values(selectedFruitArr[0]));
    }
    if (selected.name === 'Frutos no chão') {
      arr.unshift(proArr.find((e) => Object.keys(e)[0] === 'ground'));
    }
    if (selected.name === 'Cipó') {
      arr.unshift(proArr.find((e) => Object.keys(e)[0] === 'vinesTree'));
    }
    if (selected.name === 'Anomalias Frutos') {
      arr.unshift(proArr.find((e) => Object.keys(e)[0] === 'anom'));
    }
    if (selected.name === 'Árvores ausentes') {
      arr.unshift(proArr.find((e) => Object.keys(e)[0] === 'missingTree'));
    }
    if (selected.name === 'Replantio') {
      arr.unshift(proArr.find((e) => Object.keys(e)[0] === 'replant'));
    }
    if (selected.name === 'Densidade foliar') {
      arr.unshift(proArr.find((e) => Object.keys(e)[0] === 'leafDens'));
    }
    if (selected.name === 'Volumes') {
      arr.push(proArr.find((e) => Object.keys(e)[0] === 'volumetry'));
    }
    if (selected.name === 'Plantas secas') {
      arr.push(proArr.find((e) => Object.keys(e)[0] === 'dry'));
    }
    return false;
  }).filter((i) => i !== false);
  const value = arr.map((e) => {
    if (Object.keys(e)[0] !== 'volumetry') {
      return Object.values(e);
    }
    return [[]];
  });

  const allSelected = value.flatMap((e) => e[0]);

  return allSelected;
};

export const getPolygonCenter = (polyPath) => {
  if (polyPath === undefined) return { lat: '', lng: '' };
  const latArr = polyPath.map((item) => item.lat);

  const lngArr = polyPath.map((item) => item.lng);

  latArr.sort();

  lngArr.sort();

  const lowestLat = latArr[0];

  const highestLat = latArr[latArr.length - 1];

  const lowestLng = lngArr[0];

  const highestLng = lngArr[lngArr.length - 1];

  const centerLatLng = {

    lat: lowestLat + ((highestLat - lowestLat) / 2),

    lng: lowestLng + ((highestLng - lowestLng) / 2),

  };

  return centerLatLng;
};

const rad = (x) => (x * Math.PI) / 180;

export const findOutClosestPoint = (prop, lat, lng) => {
  const R = 6371; // radius of earth in km
  const distances = [];
  let closest2 = -1;
  prop.forEach((point, i) => {
    const mlat = point.latitude;
    const mlng = point.longitude;
    const dLat = rad(mlat - lat);
    const dLong = rad(mlng - lng);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
      + Math.cos(rad(lat)) * Math.cos(rad(lat))
      * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    distances[i] = d;
    if (closest2 === -1 || d < distances[closest2]) {
      closest2 = i;
    }
  });

  const obj = {
    distanceIndex: closest2,
    distance: distances[closest2],
  };

  return obj;
};

export const lastClickedHeatmap = (filterName, heatmapArr) => {
  const lastFilter = filterName.at(-1).name;
  const lastHeatmap = heatmapArr.find((last) => last.key.split('-')[0] === lastFilter);
  return lastHeatmap;
};

export const getSummaryRequest = (array) => {
  let arr = {};
  if (array.data?.length > 0) {
    let totalMad = 0;
    let totalVerd = 0;
    let totalMadAnom = 0;
    let totalVerdAnom = 0;
    let totalSemiMad = 0;
    array.data.map((cat) => {
      cat.data.map((e) => {
        switch (e.name) {
          case 'Fruta Madura':
            totalMad += e.total;
            break;
          case 'Fruta Verde':
            totalVerd += e.total;
            break;
          case 'Madura Anomalia':
            totalMadAnom += e.total;
            break;
          case 'Verde Anomalia':
            totalVerdAnom += e.total;
            break;
          case 'Fruta Semi Madura':
            totalSemiMad += e.total;
            break;
          default:
            break;
        }
        arr = {
          variables: cat.variables,
          summary: [
            { name: 'Fruta Madura', total: totalMad },
            { name: 'Fruta Verde', total: totalVerd },
            { name: 'Madura Anomalia', total: totalMadAnom },
            { name: 'Verde Anomalia', total: totalVerdAnom },
            { name: 'Fruta Semi Madura', total: totalSemiMad },
          ],
        };
        return arr;
      });
      return false;
    });
  }
  return { loading: false, data: arr };
};

const localName = {
  development: 'development',
  deploy: 'development',
  localhost: 'test',
  production: 'production',
};

export const showVersion = () => {
  // let version = 'test';
  const local = window.location.hostname.split('-')[0];
  if (Object.prototype.hasOwnProperty.call(localName, local)) {
    return localName[local];
  }
  return localName.production;
};

export const getAge = (plant, visit) => {
  const startAge = plant !== null ? new Date(plant) : new Date(visit);
  const endAge = plant !== null ? new Date(visit) : new Date();
  const age = formatDifference(startAge, endAge);
  return ({ id: age, name: `${age} anos` });
};

const categories = {
  ages: { id: 'plating_date', name: 'visit_date' },
  blocks: { id: 'ID', name: 'cod_block' },
  varieties: { id: 'variedade_ID', name: 'nome_varieade' },
  spacings: { id: 'espacamento', name: 'espacamento' },
  grafts: { id: 'enxerto_id', name: 'nome_enxerto' },
};

export const formatGraft = (data) => {
  const graft = data
    .filter((block) => block.nome_enxerto !== null || block.enxerto_id !== null)
    .map((block) => ({ id: Number(block.enxerto_id), name: block.nome_enxerto }));
  return removeDuplicateObjects(graft, 'name');
};

export const formatAge = (data, filterBy) => {
  const age = data.map((block) => ({
    ...getAge(block.plating_date, block.visit_date),
    block: block.cod_block,
    dateVisit: block.visit_date,
    varietyId: Number(block.variedade_ID),
    spacingName: `${block.espacamento} m`,
    graftId: Number(block.enxerto_id),
    plantedDate: block.plating_date,
  }));

  return removeDuplicateObjects(age, filterBy).sort((a, b) => a.id - b.id);
};

export const formatBlocks = (data) => {
  const blocks = data.map((block) => ({
    id: Number(block.ID),
    name: String(block.cod_block),
    varietyId: Number(block.variedade_ID),
    spacingName: `${block.espacamento} m`,
    graftId: Number(block.enxerto_id),
    plantedDate: block.plating_date,
    visitedDate: block.visit_date,
  })).sort((blockA, blockB) => Number(blockA.name) - Number(blockB.name));
  return removeDuplicateObjects(blocks, 'name');
};

export const formatVarieties = (data) => {
  const variety = data.filter(
    (block) => block.variedade_ID !== null || block.nome_varieade !== null,
  ).map((block) => ({
    id: Number(block.variedade_ID),
    name: block.nome_varieade,
    graftId: Number(block.enxerto_id),
    plantedDate: block.plating_date,
    visitedDate: block.visit_date,
  }));
  return removeDuplicateObjects(variety, 'name').sort((a, b) => b.name - a.name);
};

export const formatSpacing = (data) => {
  const spacing = data.filter((block) => block.espacamento !== null)
    .map((block) => {
      const check = !(Number(block.espacamento) % 1);
      if (!check) {
        return ({
          id: Math.round(Number(block.espacamento)),
          name: `${String(block.espacamento)} m`,
          varietyId: Number(block.variedade_ID),
          graftId: Number(block.enxerto_id),
          plantedDate: block.plating_date,
          visitedDate: block.visit_date,
        });
      }
      return ({
        id: Number(block.espacamento),
        name: `${String(block.espacamento)} m`,
        varietyId: Number(block.variedade_ID),
        graftId: Number(block.enxerto_id),
        plantedDate: block.plating_date,
        visitedDate: block.visit_date,
      });
    }).sort((itemA, itemB) => Number(itemA.id) - Number(itemB.id));
  return removeDuplicateObjects(spacing, 'name');
};

export const formatModal = {
  age: (data, filterBy) => formatAge(data, filterBy),
  spacing: (data) => formatSpacing(data),
  block: (data) => formatBlocks(data),
  varieties: (data) => formatVarieties(data),
  grafts: (data) => formatGraft(data),
};

const filterToModal = {
  varieties: (keyName, value, filteredFinal) => {
    const key = categories[keyName];
    const varietiesId = value.map((element) => element.id);
    const filteredByVariety = filteredFinal.filter((e) => varietiesId.includes(e[key.id]));
    return filteredByVariety;
  },
  spacings: (keyName, value, filteredFinal) => {
    const key = categories[keyName];
    const spacingName = value.map((element) => element.name);

    const filteredBySpacing = filteredFinal.filter((e) => spacingName.includes(`${e[key.id]} m`));
    return filteredBySpacing;
  },
  ages: (keyName, value, filteredFinal) => {
    const key = categories[keyName];
    const ageVisitedDate = value.map((call) => call.id);

    const filteredByAge = filteredFinal
      .filter((e) => {
        const dated = getAge(e[key.id], e[key.name]);
        return ageVisitedDate.includes(dated.id);
      });
    return filteredByAge;
  },
  blocks: (keyName, value, filteredFinal) => {
    const key = categories[keyName];
    const varietiesId = value.map((element) => element.id);
    const filteredByAge = filteredFinal.filter((e) => varietiesId.includes(e[key.id]));
    return filteredByAge;
  },
};

export const filteringModal = (object, array) => {
  // const {
  //   varieties,
  //   blocks,
  //   ages,
  //   spacings,
  // } = object;

  let filteredFinal = array;

  const resTeste = (Object.entries(object).map((each) => {
    if (each[1]?.length > 0) {
      filteredFinal = filterToModal[each[0]](each[0], each[1], filteredFinal);
      return filteredFinal;
    }
    return false;
  }).filter((e) => e !== false).at(-1));

  return (resTeste || filteredFinal);
};

export const formatCategory = (category, data) => {
  const key = categories[category];
  const resolve = data.map((block) => {
    if (category !== 'ages') {
      return ({ id: block[key.id], name: block[key.name] });
    }
    return getAge(block[key.id], block[key.name]);
  });
  if (category !== 'ages') {
    return removeDuplicateObjects(resolve, 'dateVisit').sort((a, b) => a.name - b.name);
  }
  return removeDuplicateObjects(resolve, 'name').sort((a, b) => a.id - b.id);
};

export const getKeysOrganized = (data) => {
  const state = {
    blocks: [],
    ages: [],
    varieties: [],
    spacing: [],
    grafts: [],
  };
  data.map((here) => {
    state.blocks
      .push({ id: here[categories.blocks.id], name: `${here[categories.blocks.name]}` });
    state.ages.push(getAge(here[categories.ages.id], here[categories.ages.name]));
    state.varieties
      .push({ id: here[categories.varieties.id], name: here[categories.varieties.name] });
    state.grafts.push({ id: here[categories.grafts.id], name: here[categories.grafts.name] });
    state.spacing.push({ id: here[categories.spacings.id], name: `${here[categories.spacings.name]} m` });
    return state;
  });

  const stateWithNoDuplicates = {
    blocks: removeDuplicateObjects(state.blocks, 'name').sort((a, b) => Number(a.name) - Number(b.name)),
    ages: removeDuplicateObjects(state.ages, 'dateVisit').sort((a, b) => a.name - b.name),
    varieties: removeDuplicateObjects(state.varieties, 'name').sort((a, b) => a.id - b.id),
    spacing: removeDuplicateObjects(state.spacing, 'name').sort((a, b) => a.id - b.id),
    grafts: removeDuplicateObjects(state.grafts, 'name').sort((a, b) => a.id - b.id),
  };
  return stateWithNoDuplicates;
};

export const getOrganizedByBlocks = (data, allBlocks) => {
  const state = allBlocks.map((value) => {
    const keyValueBlock = {
      blocks: { id: '', name: '' },
      ages: [],
      varieties: [],
    };
    const ret = data.map((here) => {
      if (here.ID === value.id) {
        keyValueBlock.ages.push(getAge(here[categories.ages.id], here[categories.ages.name]));
        keyValueBlock.varieties
          .push({ id: here[categories.varieties.id], name: here[categories.varieties.name] });
      }
      return { ...keyValueBlock, blocks: value };
    });
    return ret[ret.length - 1];
  });

  return (state.map((each) => ({
    blocks: each.blocks,
    ages: removeDuplicateObjects(each.ages, 'dateVisit'),
    varieties: removeDuplicateObjects(each.varieties, 'name'),
  })));
};
