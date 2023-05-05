import { ethers } from "ethers"

const getTokenBalance = async (token: ethers.Contract, address: string): Promise<ethers.BigNumber> => {
  const balance = await token.balanceOf(address)

  return balance
}

export default getTokenBalance