import axios from 'axios';
import { trace } from 'firebase/performance';
import { volumetries } from '../service/api';
import { perf } from '../service/firebase';
// import { returnFlowerResponse } from './format';

const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
  ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));

/* eslint-disable import/prefer-default-export */
const getChartVolumetriesResponse = async (token, period, block) => {
  const response = await volumetries(token, period, block);
  // console.log(response);
  // const label = response.map((line) => line.line);
  // console.log(label);
  return {
    block,
    heath: response,
    noHeath: response,
  };
};

const getVolumetriesByBlockId = async (value, token) => {
  const arr = [];
  // ga: tempo gasto para o request
  const t = trace(perf, `volumetry-${username}-${value.name}-${value.id}`);

  t.start();
  const data = value.blocks.map(async (blocks) => {
    const res = await getChartVolumetriesResponse(token, value.period, blocks.id);
    if (res.block[0] !== 0) {
      arr.push(res);
    }
    return arr;
  });
  t.stop();
  const reveled = await (await axios.all(data))
    .splice(0, 1)[0];
  // console.log(reveled);
  // const finalFormat = returnFlowerResponse(reveled, value);
  // // console.log(finalFormat);
  return { loading: true, data: reveled };
};

export { getVolumetriesByBlockId };
