/* eslint-disable import/prefer-default-export */
import axios from 'axios';
import { trace } from 'firebase/performance';
import { classId } from '../constants';
import { ripeningsCount } from '../service/api';
import { perf } from '../service/firebase';
import { returnRipeningsResponse } from './format';

const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
  ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));

const getChartRipeningsResponse = async (token, period, block) => {
  const response = await ripeningsCount(token, period, block);
  // console.log(response);
  const obj = [response].map((e) => {
    const objSorted = { id: [1, 2, 3, 33, 34], count: [0, 0, 0, 0, 0] };
    e.class_id_list.forEach((element, index) => {
      switch (element) {
        case 1:
          objSorted.count[0] = e.count_list[index];
          objSorted.id[0] = 1;
          break;
        case 2:
          objSorted.count[1] = e.count_list[index];
          objSorted.id[1] = 2;
          break;
        case 3:
          objSorted.count[2] = e.count_list[index];
          objSorted.id[2] = 3;
          break;
        case 33:
          objSorted.count[3] = e.count_list[index];
          objSorted.id[3] = 33;
          break;
        case 34:
          objSorted.count[4] = e.count_list[index];
          objSorted.id[4] = 34;
          break;
        default:
          break;
      }
    });
    const count = objSorted.count.filter((value) => value !== 0);
    const sum = count.reduce((a, b) => a + b, 0);
    const percent = count.map((value) => parseFloat(((value / sum) * 100).toFixed(2)));

    const nameId = [];
    classId.map((elment) => {
      e.class_id_list.map((into) => {
        // console.log(Number(elment.id), Number(into));
        if (Number(elment.id) === Number(into)) {
          return nameId.push(elment.name);
        }
        return false;
      });
      return false;
    });
    const id = objSorted.count
      .map((elem, z) => elem !== 0 && objSorted.id[z])
      .filter((i) => i !== false);

    return {
      block,
      blockId: block,
      id,
      nameId,
      count,
      sum,
      percent,
    };
  });
  return obj[0];
};

const getRipeningsByBlockId = async (value, token) => {
  const arr = [];
  // ga: tempo gasto para o request
  const t = trace(perf, `ripening-${username}`);

  t.start();
  const data = value.blocks.map(async (blocks) => {
    const res = await getChartRipeningsResponse(token, value.period, blocks.id);
    // console.log(res);
    if (res.sum !== 0) {
      arr.push(res);
    }
    return arr;
  });
  t.stop();
  const reveled = await (await axios.all(data))
    .splice(0, 1)[0].sort((a, b) => a.block - b.block);
  // console.log(reveled);
  const finalFormat = returnRipeningsResponse(reveled, value);
  return { loading: true, data: finalFormat };
};

export { getRipeningsByBlockId };
