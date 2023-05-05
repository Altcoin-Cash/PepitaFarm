import { ethers } from "ethers";
import LpToken from "../types/LpToken";
import Token from "../types/Token";
import getAltPrice from "./getAltPrice";

type StakedToken = Token | LpToken;

const getUpdatedPrices = async (tokens: StakedToken[]) => {
  const updatedPrices = getPricesForTokens(tokens);

  return updatedPrices;
};

export default getUpdatedPrices;

async function getPricesForTokens(
  tokens: StakedToken[]
): Promise<Map<string, ethers.BigNumber>> {
  const altPrice = await getAltPrice();
  const twelweZeros = "0".repeat(12);
  const altPriceAsString = altPrice.price * 10 ** 6 + twelweZeros; // A real hack to get ALT price to a string which is BigNumberish
  const knownPrices = new Map<string, ethers.BigNumber>();

  knownPrices.set(
    altPrice.tokenAddress.toLowerCase(),
    ethers.BigNumber.from(altPriceAsString)
  );
  let tokensWithoutPrice = tokens;

  knownPrices.forEach((price, tokenAddress) => {
    const stakedTokensWithKnownPrice = tokensWithoutPrice.filter((token) =>
      hasKnownToken(token, tokenAddress)
    );
    tokensWithoutPrice = tokensWithoutPrice.filter(
      (token) => !hasKnownToken(token, tokenAddress)
    );

    stakedTokensWithKnownPrice.forEach((token) => {
      if (token.tokens.length === 1) {
        // Token is single sided farm and we already know the price
      } else {
        // Token is LP farm
        const lpToken = token as LpToken;
        const knownTokenIndex = lowerCase(lpToken.tokens).indexOf(tokenAddress);
        const knownTokenAmount =
          knownTokenIndex === 0 ? lpToken.q0 : lpToken.q1;
        const knownTokenTotalValue = knownTokenAmount.mul(price);

        const secondaryTokenAddress =
          lpToken.tokens[knownTokenIndex == 0 ? 1 : 0].toLowerCase();
        const secondaryTokenAmount =
          knownTokenIndex === 0 ? lpToken.q1 : lpToken.q0;
        const secondaryTokenPrice =
          knownTokenTotalValue.div(secondaryTokenAmount);

        knownPrices.set(secondaryTokenAddress, secondaryTokenPrice);
      }
    });
  });

  return knownPrices;
}

function hasKnownToken(token: StakedToken, tokenAddress: string): boolean {
  const lowerCasedTokenAddresses = lowerCase(token.tokens);
  return lowerCasedTokenAddresses.includes(tokenAddress);
}

function lowerCase(array: string[]): string[] {
  return array.map((item) => item.toLowerCase());
}
