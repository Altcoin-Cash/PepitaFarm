import { ethers } from "ethers";

const getPendingRewards = async (
  pid: number,
  userAddress: string,
  PepitaMaster: ethers.Contract
): Promise<number> => {
  const pending = ethers.utils.formatUnits(
    await PepitaMaster.pendingChad(pid, userAddress)
  );

  return parseFloat(pending);
};

export default getPendingRewards;
