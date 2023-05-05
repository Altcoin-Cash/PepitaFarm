import { ethers } from "ethers";
import getTokenBalance from "../helpers/getTokenBalance";
import Token from "./Token";

class LpToken extends Token {
  token0: ethers.Contract;
  q0: ethers.BigNumber;
  token1: ethers.Contract;
  q1: ethers.BigNumber;

  constructor(
    address: string,
    name: string,
    symbol: string,
    totalSupply: ethers.BigNumber,
    decimals: number,
    staked: ethers.BigNumber,
    balanceInUserWallet: ethers.BigNumber,
    contract: ethers.Contract,
    tokens: string[],
    token0: ethers.Contract,
    q0: ethers.BigNumber = ethers.BigNumber.from(0),
    token1: ethers.Contract,
    q1: ethers.BigNumber = ethers.BigNumber.from(0)
  ) {
    super(
      address,
      name,
      symbol,
      totalSupply,
      decimals,
      staked,
      balanceInUserWallet,
      contract,
      tokens
    );
    this.token0 = token0;
    this.q0 = q0;
    this.token1 = token1;
    this.q1 = q1;
  }

  async getTvl(prices: Map<string, ethers.BigNumber>): Promise<string> {
    const [token0Price, token1Price] = [
      prices.get(this.tokens[0].toLowerCase()),
      prices.get(this.tokens[1].toLowerCase()),
    ];
    const [token0Amount, token1Amount] = [this.q0, this.q1];
    const [token0Value, token1Value] = [
      token0Price.mul(token0Amount),
      token1Price.mul(token1Amount),
    ];

    const lpTvl = token0Value.add(token1Value);

    if (this.stakedOnFarm === null) {
      const PEPI_MASTER_ADDRESS = "0x2675f42eC760f6252660778E97Ee64Da062CE897";
      const stakedAmount = await getTokenBalance(
        this.contract,
        PEPI_MASTER_ADDRESS
      );
      this.stakedOnFarm = stakedAmount;
    }

    const lockedTvl = lpTvl.mul(this.stakedOnFarm).div(this.totalSupply);
    const stringifiedTvl = ethers.utils.formatUnits(lockedTvl, 36);

    return stringifiedTvl.substring(0, stringifiedTvl.indexOf(".") + 2);
  }

  async getUpdated(userWalletAddress): Promise<LpToken> {
    const PEPI_MASTER_ADDRESS = "0x2675f42eC760f6252660778E97Ee64Da062CE897";
    const updatedStakeAmount = await getTokenBalance(
      this.contract,
      PEPI_MASTER_ADDRESS
    );
    const updatedBalanceInUserWallet = await getTokenBalance(
      this.contract,
      userWalletAddress
    );
    const reserves = await this.contract.getReserves();
    const q0 = reserves._reserve0;
    const q1 = reserves._reserve1;

    return new LpToken(
      this.address,
      this.name,
      this.symbol,
      this.totalSupply,
      this.decimals,
      updatedStakeAmount,
      updatedBalanceInUserWallet,
      this.contract,
      this.tokens,
      this.token0,
      q0,
      this.token1,
      q1
    );
  }
}

export default LpToken;
