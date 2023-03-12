import axios from 'axios';
import { trace } from 'firebase/performance';
import { classId } from '../constants';
import { fruitCount } from '../service/api';
import { perf } from '../service/firebase';
import { returnSizeResponse } from './format';

const username = JSON.parse(localStorage.getItem('user'))?.includes('@')
  ? JSON.parse(localStorage.getItem('user')).split('@')[0] : JSON.parse(localStorage.getItem('user'));

const getChartFruitsRequest = async (token, period, block) => {
  // consulta pelo block_id e data de inicio e fim;
  // retorna contagem de frutos de categorias diferentes
  const response = await fruitCount(token, period, block);
  // console.log(block, response);
  const obj = response.map((e) => {
    const arrFruit = [];
    const arrWidth = [];
    let sum = 0;
    let percent = 0;
    const xLabel = [0, 5, 10, 15, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

    response.forEach((object) => {
      if (object.class_id === e.class_id) {
        arrFruit.push(object.fruitcount);
        arrWidth.push(object.Width3D);
      }
      sum += object.fruitcount;
    });

    const fruitCountOrganized = xLabel.map((x) => {
      if (arrWidth.includes(x)) {
        const index = arrWidth.indexOf(x);
        return arrFruit[index];
      }
      return 0;
    });
    // for (let j = 0; j < response.length; j += 1) {
    //   if (response[j].class_id === e.class_id) {
    //     arrFruit.push(response[j].fruitcount);
    //     arrWidth.push(response[j].Width3D);
    //   }
    //   sum += response[j].fruitcount;
    // }
    // console.log(arrFruit, arrFruitTeste, arrWidth, arrWidthTeste, sum, sumTeste);
    // sum = arrFruit.reduce((a, b) => a + b, 0);
    percent = fruitCountOrganized.map((value) => parseFloat(((value / sum) * 100).toFixed(2)));
    const names = classId.find((index) => index.id === Number(e.class_id) && index.name);
    return {
      id: e.class_id,
      nameId: names && names.name,
      blockId: e.block_id,
      width3D: xLabel,
      count: fruitCountOrganized,
      sum,
      percent,
      len: arrFruit.length,
    };
  });
  // console.log(obj);
  const final = [];
  obj.map((e) => {
    if (final.length === 0) {
      return final.push(e);
    }
    if (final[final.length - 1].id !== e.id) {
      return final.push(e);
    }
    return false;
  });
  // console.log(final);
  return final;
};

const getDiameterByBlockId = async (value, token) => {
  const arr = [];
  // ga: tempo gasto para o request
  const t = trace(perf, `fruitCount-${username}`);

  t.start();
  const data = value.blocks.map(async (blocks) => {
    const res = await getChartFruitsRequest(token, value.period, blocks.id);
    // console.log(res);
    if (res[0].sum !== 0) {
      arr.push(...res);
    }
    return arr;
  });
  t.stop();
  const reveled = await (await axios.all(data))
    .splice(0, 1)[0].sort((a, b) => a.blockId - b.blockId);
  // console.log(reveled);
  const finalFormat = returnSizeResponse(reveled, value);
  // console.log(finalFormat);
  return { loading: true, data: finalFormat };
};

export {
  getDiameterByBlockId,
  getChartFruitsRequest,
};
