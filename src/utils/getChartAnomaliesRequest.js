// import axios from 'axios';
// import { getAnomalies } from '../constants';
// import { anomalies } from '../service/api';
// import { returnAnomResponse } from './format';

// /* eslint-disable import/prefer-default-export */
// const getChartAnomaliesResponse = async (token, period, block) => {
//   const response = await anomalies(token, period, block);
//   const arr = response;
//   const arrAnom = [];
//   if (response.length !== 0) {
//     getAnomalies.map((anom) => {
//       let count = 0;
//       arr.map((value, index) => {
//         if (Number(anom.ID) === Number(value.anomaly_id)) {
//           count += 1;
//           arr.splice(index, 1);
//         }
//         return false;
//       }).filter((e) => e !== false);
//       return arrAnom.push({ name: anom.name, count });
//     });
//     // console.log((arrAnom.map((e) => e.count)).every((item) => item !== 0));
//     return {
//       block,
//       labels: arrAnom.map((e) => e.name),
//       count: (arrAnom.map((e) => e.count)).every((item) => item !== 0)
//         ? [] : arrAnom.map((e) => e.count),
//     };
//   }
//   return {
//     block,
//     labels: response,
//     count: response,
//   };
// };

// const getAnomaliesByBlockId = async (value, token) => {
//   const arr = [];
//   const data = value.blocks.map(async (blocks) => {
//     const res = await getChartAnomaliesResponse(token, value.period, blocks.id);
//     if (res.block[0] !== 0) {
//       arr.push(res);
//     }
//     return arr;
//   });
//   const reveled = await (await axios.all(data))
//     .splice(0, 1)[0];
//   // console.log(reveled);
//   const finalFormat = returnAnomResponse(reveled, value);
//   // console.log(finalFormat);
//   return { loading: true, data: finalFormat };
// };

// export { getAnomaliesByBlockId };
