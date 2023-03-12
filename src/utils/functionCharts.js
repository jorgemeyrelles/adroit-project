import {
  classId,
  // classIdOld,
} from '../constants';
import { fruitCount, ripeningsCount, volumetries } from '../service/api';

const getTableRequest = async (token, period, block) => {
  const response = await ripeningsCount(token, period, block);

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

const getChartFruitsRequest = async (token, period, block) => {
  const all = [];
  const response = await fruitCount(token, period, block);
  block.forEach((blockId) => {
    const arr = {
      one: { fruit: [], sum: 0, width3D: [] },
      two: { fruit: [], sum: 0, width3D: [] },
      three: { fruit: [], sum: 0, width3D: [] },
      tt: { fruit: [], sum: 0, width3D: [] },
      tf: { fruit: [], sum: 0, width3D: [] },
    };
    let sum = 0;
    response.map((ob) => {
      if (Number(blockId) === Number(ob.block_id)) {
        switch (ob.class_id) {
          case 1:
            arr.one.fruit.push(ob.fruitcount);
            arr.one.width3D.push(ob.Width3D);
            // arr.one.sum += ob.fruitcount;
            break;
          case 2:
            arr.two.fruit.push(ob.fruitcount);
            arr.two.width3D.push(ob.Width3D);
            // arr.two.sum += ob.fruitcount;
            break;
          case 3:
            arr.three.fruit.push(ob.fruitcount);
            arr.three.width3D.push(ob.Width3D);
            // arr.three.sum += ob.fruitcount;
            break;
          case 33:
            arr.tt.fruit.push(ob.fruitcount);
            arr.tt.width3D.push(ob.Width3D);
            // arr.tt.sum += ob.fruitcount;
            break;
          case 34:
            arr.tf.fruit.push(ob.fruitcount);
            arr.tf.width3D.push(ob.Width3D);
            // arr.tf.sum += ob.fruitcount;
            break;
          default:
            break;
        }
        sum += ob.fruitcount;
      }
      return false;
    });
    all.push(
      {
        ...arr.one,
        sum,
        percent: arr.one.fruit.map((value) => parseFloat(((value / sum) * 100).toFixed(2))),
        nameId: classId.find((index) => index.id === 1 && index.name).name,
        id: 1,
        blockId,
      },
      {
        ...arr.two,
        sum,
        percent: arr.two.fruit.map((value) => parseFloat(((value / sum) * 100).toFixed(2))),
        nameId: classId.find((index) => index.id === 2 && index.name).name,
        id: 2,
        blockId,
      },
      {
        ...arr.three,
        sum,
        percent: arr.three.fruit.map((value) => parseFloat(((value / sum) * 100).toFixed(2))),
        nameId: classId.find((index) => index.id === 3 && index.name).name,
        id: 3,
        blockId,
      },
      {
        ...arr.tt,
        sum,
        percent: arr.tt.fruit.map((value) => parseFloat(((value / sum) * 100).toFixed(2))),
        nameId: classId.find((index) => index.id === 33 && index.name).name,
        id: 33,
        blockId,
      },
      {
        ...arr.tf,
        sum,
        percent: arr.tf.fruit.map((value) => parseFloat(((value / sum) * 100).toFixed(2))),
        nameId: classId.find((index) => index.id === 34 && index.name).name,
        id: 34,
        blockId,
      },
    );
    return false;
  });
  return all.filter((element) => element.fruit.length !== 0);
};

const getChartVolumetriesResponse = async (token, period, block) => {
  const response = await volumetries(token, period, block);
  // console.log(response, period, block);
  // const label = response.map((line) => line.line);
  // console.log(label);
  return {
    block,
    heath: response,
    noHeath: response,
  };
};

const getChartRipeningsResponse = async (token, period, block) => {
  const response = await ripeningsCount(token, period, block);

  const obj = [response].map((e) => {
    const sum = e.count_list.reduce((a, b) => a + b, 0);
    const percent = e.count_list.map((value) => parseFloat(((value / sum) * 100).toFixed(2)));

    const nameId = [];
    classId.map((elment) => {
      e.class_id_list.map((into) => {
        if (Number(elment.id) === Number(into)) {
          return nameId.push(elment.name);
        }
        return false;
      });
      return false;
    });
    // console.log(nameId);
    return {
      block,
      blockId: block,
      id: e.class_id_list,
      nameId,
      count: e.count_list,
      sum,
      percent,
    };
  });
  return obj[0];
};

export {
  getTableRequest,
  getChartFruitsRequest,
  getChartVolumetriesResponse,
  getChartRipeningsResponse,
};
