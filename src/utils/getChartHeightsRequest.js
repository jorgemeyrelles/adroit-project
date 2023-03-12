import axios from 'axios';
import { trace } from 'firebase/performance';
import { treeHeighCount } from '../service/api';
import { perf } from '../service/firebase';
import { returnHeightResponse } from './format';

const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
  ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));

/* eslint-disable import/prefer-default-export */
const getChartTreeHeightResponse = async (token, period, block) => {
  const response = await treeHeighCount(token, period, block);
  const arr = response.height_list;
  if (response.height_list.length >= 1 && response.height_list[0] !== 0) {
    const min = Math.floor(Math.min.apply(null, response.height_list));
    const max = Math.ceil(Math.max.apply(null, response.height_list));
    const arrHei = [];
    for (let i = min; i <= max; i += 1) {
      arrHei.push(i);
    }
    const organized = [];
    arrHei.forEach((minMax) => {
      const one = [0, 0];
      arr.map((height, index) => {
        if (height >= minMax && height < minMax + 0.5) {
          one[0] += 1;
          arr.splice(index, 1);
        }
        if (height + 0.5 >= minMax && height < minMax + 1) {
          one[1] += 1;
          arr.splice(index, 1);
        }
        return one;
      });
      organized.push(
        { [`${minMax}`]: one[0] },
        { [`${minMax + 0.5} - ${minMax + 1}`]: one[1] },
      );
      return organized;
    });
    const sum = response.height_list.reduce((a, b) => a + b, 0);
    const percent = organized.map((e) => Object.values(e)[0])
      .map((i) => parseFloat(((i / sum) * 100).toFixed(2)));
    return {
      block,
      labels: organized.map((e) => Object.keys(e)[0]).splice(0, (max * 2) - 2),
      count: organized.map((e) => Object.values(e)[0]).splice(0, (max * 2) - 2),
      percent: percent.splice(0, (max * 2) - 2),
      sum,
    };
  }
  return {
    block,
    labels: response.height_list,
    count: response.height_list,
  };
};

const getTreeHeightByBlockId = async (value, token) => {
  const arr = [];
  // ga: tempo gasto para o request
  const t = trace(perf, `heightTree-${username}`);

  t.start();
  const data = value.blocks.map(async (blocks) => {
    const res = await getChartTreeHeightResponse(token, value.period, blocks.id);
    if (res.count[0] !== 0) {
      arr.push(res);
    }
    return arr;
  });
  t.stop();
  const reveled = await (await axios.all(data))
    .splice(0, 1)[0];
  const finalFormat = returnHeightResponse(reveled, value);
  return { loading: true, data: finalFormat };
};

export { getTreeHeightByBlockId };
