import Price from "../types/Price";

const WALT_ADDRESS = "0x48721ADeFE5b97101722c0866c2AffCE797C32b6";

const getAltPrice = async (): Promise<Price> => {
  const response = await fetch(
    "https://api.coinpaprika.com/v1/tickers/alt-altcoinchain?quotes=USD"
  );
  const data = await response.json();

  return {
    tokenAddress: WALT_ADDRESS,
    price: data.alt.alt,
  };
};

export default getAltPrice;
