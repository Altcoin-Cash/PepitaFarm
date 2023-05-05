import Price from "../types/Price";

const WALT_ADDRESS = "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83";

const getFtmPrice = async (): Promise<Price> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=fantom&vs_currencies=usd"
  );
  const data = await response.json();

  return {
    tokenAddress: WALT_ADDRESS,
    price: data.fantom.usd,
  };
};

export default getFtmPrice;
