import { NUM_LATEST_BLOCKS } from '../../../config';
import api from '../../api';

const getLatestBlocks = async () => {
  const latestBlockNumber = await api.core.getBlockNumber();
  const blockNumbers = Array.from({ length: NUM_LATEST_BLOCKS }, (_, i) => latestBlockNumber - i);
  const blockPromises = blockNumbers.map((blockNumber) => api.core.getBlock(blockNumber));
  const blocks = await Promise.all(blockPromises);
  return blocks;
};

export default getLatestBlocks;
