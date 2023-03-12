/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { returnFruitsResponse, returnRipeningsResponse, returnSizeResponse } from './format';
import {
  getChartFruitsRequest, getChartRipeningsResponse, getChartVolumetriesResponse, getTableRequest,
} from './functionCharts';

const getFruitsCountByBlockIdToTable = async (value, token) => {
  const arr = [];
  const data = value.blocks.map(async (blocks) => {
    const res = await getTableRequest(token, value.period, blocks.id);
    if (res[0].blockId !== 0) {
      arr.push(...res);
    }
    return arr;
  });
  const reveled = await (await axios.all(data))
    .splice(0, 1)[0].sort((a, b) => a.blockId - b.blockId);
  const finalFormat = returnFruitsResponse(reveled, value);
  return { loading: true, data: finalFormat };
};

const getDiameterByBlockId = async (value, token) => {
  const blocks = value.blocks.map((bl) => bl.id);
  const res = await getChartFruitsRequest(token, value.period, blocks);
  const finalFormat = returnSizeResponse(res, value);
  return { loading: true, data: finalFormat };
};

const getVolumetriesByBlockIdTeste = async (value, token) => {
  // const arr = [];
  const blocks = value.blocks.map((bl) => bl.id);
  const res = await getChartVolumetriesResponse(token, value.period, blocks);
  // const data = value.blocks.map(async (blocks) => {
  //   const res = await getChartVolumetriesResponse(token, value.period, blocks.id);
  //   if (res.block[0] !== 0) {
  //     arr.push(res);
  //   }data
  //   return arr;
  // });
  const reveled = await (await axios.all(res))
    .splice(0, 1)[0];
  // console.log(reveled);
  // const finalFormat = returnFlowerResponse(reveled, value);
  // // console.log(finalFormat);
  return { loading: true, data: reveled };
};

const getRipeningsByBlockIdTeste = async (value, token) => {
  const arr = [];
  const data = value.blocks.map(async (blocks) => {
    const res = await getChartRipeningsResponse(token, value.period, blocks.id);
    if (res.sum !== 0) {
      arr.push(res);
    }
    return arr;
  });
  const reveled = await (await axios.all(data))
    .splice(0, 1)[0].sort((a, b) => a.block - b.block);
  const finalFormat = returnRipeningsResponse(reveled, value);
  return { loading: true, data: finalFormat };
};

export {
  getFruitsCountByBlockIdToTable,
  getDiameterByBlockId,
  getVolumetriesByBlockIdTeste,
  getRipeningsByBlockIdTeste,
};
