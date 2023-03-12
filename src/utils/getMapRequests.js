import { trace } from 'firebase/performance';
import * as zip from '@zip.js/zip.js';
import axios from 'axios';

import {
  anomalyByIdAndBlockMaps,
  anomalyMaps,
  blockShape,
  countGeo,
  densityMaps,
  dryTreeMaps,
  getMaps,
  missingTreeMaps,
  onGroundMaps,
  replantedTreeMaps,
  volumetryMaps,
} from '../service/apiMaps';
import { perf } from '../service/firebase';
import { blockColors } from '../constants';

const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
  ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));

const getFruitsCountResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-fruitCount-${username}`);

  t.start();
  const response = await countGeo(token, value.period, blocks);
  t.stop();

  const classId = response.class_list;

  const classOne = [];
  const classTwo = [];
  const classTt = [];
  const classTf = [];
  const classThree = [];
  response.count_list.map((countElem, index) => {
    switch (Number(classId[index])) {
      case 1:
        classOne.push({
          class: Number(classId[index]),
          weight: countElem,
          image_id: response.image_list[index],
          latitude: response.latitude[index],
          longitude: response.longitude[index],
          name: 'Fruta Madura',
        });
        break;
      case 2:
        classTwo.push({
          class: Number(classId[index]),
          weight: countElem,
          image_id: response.image_list[index],
          latitude: response.latitude[index],
          longitude: response.longitude[index],
          name: 'Fruta Verde',
        });
        break;
      case 33:
        classTt.push({
          class: Number(classId[index]),
          weight: countElem,
          image_id: response.image_list[index],
          latitude: response.latitude[index],
          longitude: response.longitude[index],
          name: 'Madura Anomalia',
        });
        break;
      case 34:
        classTf.push({
          class: Number(classId[index]),
          weight: countElem,
          image_id: response.image_list[index],
          latitude: response.latitude[index],
          longitude: response.longitude[index],
          name: 'Verde Anomalia',
        });
        break;
      case 58:
        classThree.push({
          class: Number(classId[index]),
          weight: countElem,
          image_id: response.image_list[index],
          latitude: response.latitude[index],
          longitude: response.longitude[index],
          name: 'Fruta Semi Madura',
        });
        break;
      default:
        break;
    }
    return false;
  });
  return [{
    loading: false,
    data: {
      coords: {
        1: classOne, 2: classTwo, 33: classTt, 34: classTf, 58: classThree,
      },
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, [
    { ripe: classOne },
    { green: classTwo },
    { ripeAnomaly: classTt },
    { greenAnomaly: classTf },
    { semiRipe: classThree },
  ], response];
};

const getFruitsOnTheGroundResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-onGround-${username}`);

  t.start();
  const response = await onGroundMaps(token, value.period, blocks);
  t.stop();

  const arr = response.map((item) => ({
    id: item.image_ID,
    image_id: item.image_ID,
    weight: item.detections_count,
    latitude: item.latitude,
    longitude: item.longitude,
    name: 'Frutos no chão',
  }));

  return [{
    loading: false,
    data: {
      coords: arr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, arr];
};

const getGeotiffProductivityResponse = async (value, blocks, token) => {
  const t = trace(perf, `map-geotiffProductivity-${username}`);

  t.start();
  const response = await getMaps(token, value.period, blocks);
  t.stop();

  const reader = new zip.ZipReader(new zip.BlobReader(response));
  const entries = await reader.getEntries();

  const overlayArr = [];
  const overlayImgArr = [];
  const entriesArr = [];
  entries.forEach((i) => entriesArr.push(i));

  if (entriesArr && entriesArr.length) {
    const jsonArr = [];

    const filteredEntry = entriesArr.find((json) => json.filename.includes('json'));
    const text = await filteredEntry.getData(
      new zip.TextWriter(),
    );
    const parsedText = await JSON.parse(text);

    const mapText = parsedText.map((item) => item);
    jsonArr.push(...mapText);

    const imageArr = entries.filter((entry) => entry.filename.includes('png'));

    const overlayImg = imageArr.map(async (data) => {
      const blockId = data.filename.split('_').at(0);
      const image = await data.getData(
        new zip.BlobWriter(),
      );
      const parsedImageUrl = URL.createObjectURL(image);

      return {
        block_id: Number(blockId),
        url: parsedImageUrl,
      };
    });

    const image = await axios.all(overlayImg);
    overlayImgArr.push(...image);

    const overlayObj = jsonArr.map(async (data) => {
      const filteredImage = overlayImgArr.filter((img) => img.block_id === data.block_id);

      return {
        block_id: data.block_id,
        url: filteredImage[0].url,
        bounds: data.position,
      };
    });
    const overlay = await axios.all(overlayObj);
    overlayArr.push(...overlay);
  }
  // close the ZipReader
  await reader.close();

  return [{
    loading: false,
    data: {
      overlay: overlayArr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, overlayArr];
};

const getVolumetriesResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-volumetry-${username}`);

  t.start();
  const response = await volumetryMaps(token, value.period, blocks);
  t.stop();
  const arr = response.map((item) => ({
    id: item.image_ID,
    weight: item.box_volume,
    latitude: item.latitude,
    longitude: item.longitude,
    name: 'Volumes',
  }));

  return [{
    loading: false,
    data: {
      coords: arr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, arr];
};

const getMissingTreesResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-missingTree-${username}`);

  t.start();
  const response = await missingTreeMaps(token, value.period, blocks);
  t.stop();

  if (response.image_list.length === 1 && response.image_list === 0) {
    return [{
      loading: false,
      data: {
        coords: [],
        variables: {
          reportId: String(value.id),
          startDate: value.period[0],
          endDate: value.period[1],
        },
      },
    }, response];
  }
  const arr = response.image_list.map((item, index) => ({
    id: item,
    image_id: item,
    latitude: response.lat_list[index],
    longitude: response.lon_list[index],
    name: 'Árvores ausentes',
  }));
  return [{
    loading: false,
    data: {
      coords: arr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, arr];
};

const getVinesTreesResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-vinesTree-${username}`);

  t.start();
  const response = await anomalyByIdAndBlockMaps(token, value.period, blocks);
  t.stop();
  const cipo = response.filter((i) => i.anomaly_id === 1);

  if (cipo.length === 1 && cipo[0] === 0) {
    return [{
      loading: false,
      data: {
        coords: [],
        variables: {
          reportId: String(value.id),
          startDate: value.period[0],
          endDate: value.period[1],
        },
      },
    }, response];
  }

  const arr = cipo.map((item) => ({
    id: item.id,
    image_id: item.id,
    latitude: item.latitude,
    longitude: item.longitude,
    name: 'Cipó',
  }));
  return [{
    loading: false,
    data: {
      coords: arr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, arr];
};

const getDryTreesResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-dryTree-${username}`);

  t.start();
  const response = await dryTreeMaps(token, value.period, blocks);
  t.stop();
  if (response.image_list.length === 1 && response.image_list === 0) {
    return [{
      loading: false,
      data: {
        coords: [],
        variables: {
          reportId: String(value.id),
          startDate: value.period[0],
          endDate: value.period[1],
        },
      },
    }, response];
  }
  const arr = response.image_list.map((item, index) => ({
    id: item,
    image_id: item,
    latitude: response.lat_list[index],
    longitude: response.lon_list[index],
    name: 'Plantas secas',
  }));
  return [{
    loading: false,
    data: {
      coords: arr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, arr];
};

const getReplantedTreesResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-replanted-${username}`);

  t.start();
  const response = await replantedTreeMaps(token, value.period, blocks);
  t.stop();
  if (response.image_list.length === 1 && response.image_list === 0) {
    return [{
      loading: false,
      data: {
        coords: [],
        variables: {
          reportId: String(value.id),
          startDate: value.period[0],
          endDate: value.period[1],
        },
      },
    }, response];
  }
  const arr = response.image_list.map((item, index) => ({
    id: item,
    image_id: item,
    latitude: response.lat_list[index],
    longitude: response.lon_list[index],
    name: 'Replantio',
  }));
  return [{
    loading: false,
    data: {
      coords: arr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, arr];
};

const getAnomaliesResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-anomalies-${username}`);

  t.start();
  const response = await anomalyMaps(token, value.period, blocks);
  t.stop();
  if (response.image_list.length === 1 && response.image_list === 0) {
    return [{
      loading: false,
      data: {
        coords: [],
        variables: {
          reportId: String(value.id),
          startDate: value.period[0],
          endDate: value.period[1],
        },
      },
    }, response];
  }
  const arr = response.image_list.map((item, index) => ({
    id: item,
    image_id: item,
    latitude: response.latitude[index],
    longitude: response.longitude[index],
    name: 'Anomalias Frutos',
  }));
  return [{
    loading: false,
    data: {
      coords: arr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, arr];
};

const getLeafDensityResponse = async (value, blocks, token) => {
  // ga: tempo gasto para o request
  const t = trace(perf, `map-leafDensity-${username}`);

  t.start();
  const response = await densityMaps(token, value.period, blocks);
  t.stop();

  if (response.image_list.length === 1 && response.image_list === 0) {
    return [{
      loading: false,
      data: {
        coords: [],
        variables: {
          reportId: String(value.id),
          startDate: value.period[0],
          endDate: value.period[1],
        },
      },
    }, response];
  }
  const arr = response.image_list.map((item, index) => ({
    id: item,
    image_id: item,
    weight: (response.density[index] * 100),
    latitude: response.lat_list[index],
    longitude: response.lon_list[index],
    name: 'Densidade foliar',
  }));
  return [{
    loading: false,
    data: {
      coords: arr,
      variables: {
        reportId: String(value.id),
        startDate: value.period[0],
        endDate: value.period[1],
      },
    },
  }, arr];
};

const getBlocksResponse = async (value, token) => {
  const blocks = value.blocks.map((bl) => bl.id);

  // ga: tempo gasto para o request
  const t = trace(perf, `map-blocks-${username}`);
  t.start();
  const response = await blockShape(token, value.period, blocks);
  t.stop();

  const arrPol = [];
  response.forEach((e) => {
    if (e.gps_polygon_points !== null) {
      const coordsTo = e.gps_polygon_points.split(';');
      arrPol.push({
        coords: coordsTo.map((i) => i.trim()),
        blockName: e.cod_block,
        id: e.id,
        variety_id: e.variety_id,
        variety_color: blockColors[e.variety_id],
      });
    }
  });
  return {
    loading: false,
    data: {
      coords: arrPol,
      variables: {
        reportId: String(value.report_id),
      },
    },
  };
};

export {
  getBlocksResponse,
  getFruitsCountResponse,
  getFruitsOnTheGroundResponse,
  getVolumetriesResponse,
  getMissingTreesResponse,
  getDryTreesResponse,
  getReplantedTreesResponse,
  getLeafDensityResponse,
  getVinesTreesResponse,
  getAnomaliesResponse,
  getGeotiffProductivityResponse,
};
