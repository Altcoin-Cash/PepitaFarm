import tw from "twin.macro";
import Counter from "../counter";
import SocialIcon from "../../../social";
import { ethers } from "ethers";
import { useState, useContext, useEffect } from "react";
import FarmsContext from "../../../../context/FarmsContext";

function HeroSection() {
  const { lpFarms, singleStakeFarms, prices } = useContext(FarmsContext);
  const [pepitaBurnt, setPepitaBurnt] = useState("loading");
  const [tvl, setTvl] = useState("loading");

  useEffect(() => {
    calculateTvl();
    getPepitaBurnt();
  }, [lpFarms, singleStakeFarms, prices]);

  const calculateTvl = async () => {
    if (lpFarms && singleStakeFarms && prices) {
      const lpTokens = lpFarms.map((f) => f.pool.stakedToken);
      const singleTokens = singleStakeFarms.map((f) => f.pool.stakedToken);
      const allTokens = [...lpTokens, ...singleTokens];

      const tvls = await Promise.all(
        allTokens.map((token) => token.getTvl(prices))
      );
      const totalTvl = tvls.reduce((sum, tvl) => parseFloat(tvl) + sum, 0);

      setTvl(
        totalTvl.toLocaleString("en-US", { style: "currency", currency: "USD" })
      );
    }
  };

  const getPepitaBurnt = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc0.altcoinchain.org/rpc"
    );
    const PEPI_TOKEN_ADDRESS = "0xbeeFB44E56885e7ACdb007D2377788daafbFca2D";
    const ERC20_ABI = [
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "_from", type: "address" },
          { name: "_to", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [{ name: "", type: "string" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      {
        constant: false,
        inputs: [
          { name: "_to", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        constant: true,
        inputs: [
          { name: "_owner", type: "address" },
          { name: "_spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ name: "", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
      },
      { payable: true, stateMutability: "payable", type: "fallback" },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "owner", type: "address" },
          { indexed: true, name: "spender", type: "address" },
          { indexed: false, name: "value", type: "uint256" },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, name: "from", type: "address" },
          { indexed: true, name: "to", type: "address" },
          { indexed: false, name: "value", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
      },
    ];
    const BreweryMasterContract = new ethers.Contract(
      PEPI_TOKEN_ADDRESS,
      ERC20_ABI,
      provider
    );
    const pepitaBurnt = await BreweryMasterContract.balanceOf(
      "0x0000000000000000000000000000000000000001"
    );
    let pepitaBurtFormatted = parseFloat(ethers.utils.formatEther(pepitaBurnt));
    setPepitaBurnt(pepitaBurtFormatted.toLocaleString("en-US", {}));
  };

  return (
    <div tw="flex relative flex-1 items-center justify-center  py-12 px-24 bg-gray-300">
      <div tw="background-color[#00910E] rounded-3xl h-full w-full font-family[tempest] py-8">
        {/* top */}
        <div tw="flex items-center">
          {/* featured image */}
          <div tw="flex flex[3]">
            <img src="/assets/images/pepita_logo.jpg" alt="" />
          </div>

          {/* Values */}
          <div tw="flex flex-1 items-start -ml-96">
            <div tw="flex items-center  flex-col">
              <span tw="text-3xl text-white"> TVL</span>
              <Counter value={tvl} />
              <span tw="text-3xl text-white"> $PEPI Burned</span>
              <Counter value={pepitaBurnt} />
            </div>
          </div>
        </div>
        {/* bottom */}
        <div tw="flex flex-col items-center">
          <span tw="text-9xl text-white">Pepita </span>
          <span tw="-mt-2 -mr-24 font-size[70px] text-white"> YieldFarm</span>
          <div tw="flex items-end -mt-6 -mr-24">
            <img src="/assets/images/Altcoinchain1.png" alt="" />
          </div>
        </div>
      </div>
      <div tw="absolute right-6 top-12 hidden md:block">
        <SocialIcon />
      </div>
    </div>
  );
}

export default HeroSection;
