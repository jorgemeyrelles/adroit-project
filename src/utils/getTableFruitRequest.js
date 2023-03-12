/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { trace } from 'firebase/performance';
import { classId } from '../constants';
import { ripeningsCount } from '../service/api';
import { perf } from '../service/firebase';
import { returnFruitsResponse } from './format';

const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
  ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));

const getTableRequest = async (token, period, block) => {
  const response = await ripeningsCount(token, period, block);
  // console.log(response);
  const arr = classId.map((categ) => {
    for (let j = 0; j < response.class_id_list.length; j += 1) {
      if (Number(categ.id) === Number(response.class_id_list[j])) {
        return {
          id: response.class_id_list[j],
          nameId: categ.name,
          blockId: response.block_id_list[j],
          width3D: response.class_id_list,
          count: response.count_list,
          sum: response.count_list[j],
          percent: response.count_list,
        };
      }
    }
    return {
      id: categ.id,
      nameId: categ.name,
      blockId: response.block_id_list[0],
      width3D: [0],
      count: [0],
      sum: 0,
      percent: [0],
    };
  });

  return arr;
};

const getFruitsCountByBlockIdToTable = async (value, token) => {
  const arr = [];
  // ga: tempo gasto para o request
  const t = trace(perf, `table-${username}`);

  t.start();
  const data = value.blocks.map(async (blocks) => {
    const res = await getTableRequest(token, value.period, blocks.id);
    // console.log(res);
    if (res[0].blockId !== 0) {
      arr.push(...res);
    }
    return arr;
  });
  t.stop();
  const reveled = await (await axios.all(data))
    .splice(0, 1)[0].sort((a, b) => a.blockId - b.blockId);

  const finalFormat = returnFruitsResponse(reveled, value);
  return { loading: true, data: finalFormat };
};

export {
  getFruitsCountByBlockIdToTable,
};
