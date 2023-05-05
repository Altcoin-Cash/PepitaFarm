import { ethers } from "ethers"

const getPendingRewards = async (pid: number, userAddress: string, masterChad: ethers.Contract): Promise<number> => {
  const pending = ethers.utils.formatUnits(await masterChad.pendingChad(pid, userAddress))

  return parseFloat(pending)
}

export default getPendingRewards