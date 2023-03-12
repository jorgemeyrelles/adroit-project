import axios from 'axios';
import { trace } from 'firebase/performance';
import { fruitsOnGround } from '../service/api';
import { perf } from '../service/firebase';
import { returnGroundResponse } from './format';

const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
  ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));

/* eslint-disable import/prefer-default-export */
const getChartOnGroundResponse = async (token, period, block) => {
  const response = await fruitsOnGround(token, period, block);

  const arr = response.count_list;
  if (response.count_list.length >= 1) {
    const max = Math.ceil(Math.max.apply(null, response.count_list));
    const arrHei = [];
    // let j = -0.25;
    let j = 0;
    do {
      arrHei.push(j);
      j += 1;
    } while (j <= max);
    const organized = [];

    arrHei.forEach((minMax) => {
      const one = [0, 0];
      arr.map((diameter, index) => {
        if (diameter >= minMax && diameter < minMax + 1) {
          one[0] += 1;
          arr.splice(index, 1);
        }
        // if (diameter + 5 >= minMax && diameter < minMax + 10) {
        //   one[1] += 1;
        //   arr.splice(index, 1);
        // }
        return one;
      });
      // organized.push(
      //   { [`${minMax} - ${minMax + 0.5}`]: one[0] },
      //   { [`${minMax + 0.5} - ${minMax + 1}`]: one[1] },
      // );
      // console.log(Object.keys(organized)[organized.length - 1]);
      organized.push(
        { [`${minMax}`]: one[0] },
        // { [`${minMax + 5}`]: one[1] },
      );
      return organized;
    });

    const sum = response.count_list.reduce((a, b) => a + b, 0);
    return {
      block,
      labels: organized.map((e) => Object.keys(e)[0]).splice(0, (max * 2)),
      count: organized.map((e) => Object.values(e)[0]).splice(0, (max * 2)),
      sum,
    };
  }
  return {
    block,
    labels: response.count_list,
    count: response.count_list,
  };
};

const getOnGroundByBlockId = async (value, token) => {
  const arr = [];
  // ga: tempo gasto para o request
  const t = trace(perf, `onGround-${username}`);

  t.start();
  const data = value.blocks.map(async (blocks) => {
    const res = await getChartOnGroundResponse(token, value.period, blocks.id);
    if (res.block[0] !== 0) {
      arr.push(res);
    }
    return arr;
  });
  t.stop();
  const reveled = await (await axios.all(data))
    .splice(0, 1)[0];
  const finalFormat = returnGroundResponse(reveled, value);
  return { loading: true, data: finalFormat };
};

export { getOnGroundByBlockId };
