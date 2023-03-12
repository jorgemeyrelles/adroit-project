import axios from 'axios';
import { treeInventory } from '../service/api';
import { returnInventoryTreesResponse } from './format';

/* eslint-disable import/prefer-default-export */
const getChartInventoryTreesResponse = async (token, period, blocks) => {
  const response = await treeInventory(token, period, blocks);
  if (response.length > 0) {
    const seedlingsSum = (response.map((e) => e.seedlings)).reduce((acc, last) => acc + last, 0);
    const drySum = (response.map((e) => e.dry_trees)).reduce((acc, last) => acc + last, 0);
    const missingSum = (response.map((e) => e.missing_trees)).reduce((acc, last) => acc + last, 0);
    // call productivityTrees
    const totalSum = (response.map((e) => e.total_trees)).reduce((acc, last) => acc + last, 0);
    const labels = ['Ausentes', 'Mudas', 'Secas'];
    return {
      block: response[0].cod_block,
      count: [missingSum, seedlingsSum, drySum],
      productivity: totalSum,
      labels,
      total: response.map((e) => e.total_trees),
    };
  }
  return {
    block: 0,
  };
};

const getInventoryTreesById = async (value, token) => {
  const arr = [];
  const data = value.blocks.map(async (blocks) => {
    const res = await getChartInventoryTreesResponse(token, value.period, blocks.id);
    if (res.block !== 0) {
      arr.push(res);
    }
    return arr;
  });
  const reveled = await (await axios.all(data)).splice(0, 1)[0]
    .sort((a, b) => a.block - b.block);
  const finalFormat = returnInventoryTreesResponse(reveled, value);

  return { loading: true, data: finalFormat };
};

export { getInventoryTreesById };
