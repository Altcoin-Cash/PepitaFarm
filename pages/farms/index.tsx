import Head from "next/head";
import { useState, useEffect, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import tw from "twin.macro";
import Nav from "../../components/nav";
import Hero from "../../components/pages/farms/hero";
import Farms from "../../components/pages/farms";
import Stakes from "../../components/pages/farms/stakes";
import SocialIcon from "../../components/social";
import getInitialPools from "../../helpers/getInitialPools";
import Farm from "../../types/Farm";
import InitialPool from "../../types/InitialPool";
import getDummyPools from "../../helpers/getDummyPools";
import getUpdatedPrices from "../../helpers/getUpdatedPrices";
import { ethers, providers } from "ethers";
import { stakesdata } from "../../data/stakes.data";
import farmsdata from "../../data/farms.data";
import FarmsContext from "../../context/FarmsContext";
import { Provider } from "@ethersproject/providers";
import { BetaPopup } from "../../components/popup";

const FarmPage: React.FC = () => {
  const { account, chainId } = useWeb3React();
  const { lpFarms, singleStakeFarms, prices, initialFetchDone } =
    useContext(FarmsContext);

  const [farms, setFarms] = useState<Farm[]>(getDummyPools(farmsdata));
  const [singleFarms, setSingleFarms] = useState<Farm[]>(
    getDummyPools(stakesdata)
  );
  const [tokenPrices, setTokenPrices] =
    useState<Map<string, ethers.BigNumber>>(prices);
  const [isStake, setStake] = useState(false);

  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    if (initialFetchDone) {
      console.log("Starting to get initial pools");
      setFarms(lpFarms);
      setSingleFarms(singleStakeFarms);

      const tokens = lpFarms
        .map((f) => f.pool.stakedToken)
        .concat(singleStakeFarms.map((sf) => sf.pool.stakedToken));

      getUpdatedPrices(tokens).then((pricesArray) => {
        setTokenPrices(pricesArray);
      });
    }
  }, [account, initialFetchDone]);

  return (
    <div tw="font-family[Tempest] min-h-screen max-h-screen">
      //
      <BetaPopup setToggle={setToggle} toggle={toggle} />
      <Head>
        <title>Farms | Pepita Farm</title>
        <meta name="description" content="Pepita Farm" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/assets/fonts/Oswald-Regular.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <div tw="absolute right-6 top-32 hidden md:block">
        <SocialIcon />
      </div>
      <div tw="background-color[#00910E]">
        <Nav />

        <div tw=" pb-4 md:py-12 md:px-24 md:bg-gray-300">
          <div tw="md:bg-white rounded-3xl flex flex-col items-center md:px-8 pt-12">
            <Hero />

            {/* Buttons */}
            <div tw="flex background-color[#00910E] border-2 border-blue-300 rounded-lg md:p-1 md:text-3xl mt-8">
              <div
                css={[
                  tw`px-6 py-1 rounded cursor-pointer`,
                  !isStake && tw`bg-white`,
                ]}
                onClick={() => setStake(false)}
              >
                FARMS
              </div>
              <div
                css={[
                  tw`px-6 py-1 rounded cursor-pointer`,
                  isStake && tw`bg-white`,
                ]}
                onClick={() => setStake(true)}
              >
                STAKE
              </div>
            </div>

            {/* stakes */}

            {!isStake && <Farms initialFarms={farms} tokenPrices={prices} />}
            {isStake && (
              <Stakes initialFarms={singleFarms} tokenPrices={prices} />
            )}
          </div>
          <div tw="-mt-12 md:hidden">
            <SocialIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmPage;
