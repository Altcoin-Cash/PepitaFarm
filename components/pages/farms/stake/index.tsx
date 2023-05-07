import tw from "twin.macro";
import { useEffect, useState } from "react";
import Popup from "../../../popup";
import StakeLp from "../../../stakelp";
import { useWeb3React } from "@web3-react/core";
import { ethers, providers } from "ethers";
import Pool from "../../../../types/Pool";
import BasicInfo from "../../../../types/BasicInfo";
import { LoadingPopup } from "../../../popup";

function numFormatter(num): string {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(2) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(2) + "M"; // convert to M for number from > 1 million
  } else if (num > 0 && num < 0.001) {
    return "< 0.001";
  } else if (num < 900) {
    return num.toString(); // if value < 1000, nothing to do
  }
}

interface StakeProps {
  basicInfo: BasicInfo;
  pool: Pool;
  prices: Map<string, ethers.BigNumber>;
}

const Stake: React.FC<StakeProps> = ({ basicInfo, pool, prices }) => {
  const { account, active } = useWeb3React();

  const [toggle, setToggle] = useState(false);
  const [poolInfo, setPoolInfo] = useState<Pool>(pool);
  const [depositMode, setDepositMode] = useState<boolean>();
  const [isApproved, setIsApproved] = useState(false);
  const [stakedAmount, setStakedAmount] = useState("-1");
  const [pendingRewards, setPendinRewards] = useState("-1");
  const [fee, setFee] = useState(-1);

  const [loading, setLoading] = useState(false);
  const popupMessage = "Harvesting PEPI";

  useEffect(() => {
    handleNewPool();
  }, [active, account, pool, prices]);

  const handleNewPool = () => {
    setFee(pool.fee);
    if (dataLoaded() && account) {
      handleApproval();
      updatePoolInfo();
    } else if (dataLoaded()) {
      updatePoolWithoutUserInfo();
      setPendinRewards("connect");
      setStakedAmount("-1");
    }
  };

  const dataLoaded = (): boolean => {
    return pool && pool.stakedToken && prices && prices.size > 0;
  };

  const updatePoolInfo = () => {
    pool.updatePool(account, prices).then((p) => {
      setPoolInfo(p);
      setPendinRewards(p.pendingRewardsForUser.toFixed(2));
      setStakedAmount(p.usersDeposit.toFixed(2));
    });
  };

  const updatePoolWithoutUserInfo = () => {
    pool.updateApr(prices).then((p) => {
      setPoolInfo(pool);
    });
  };

  useEffect(() => {
    if (active) {
      // @ts-ignore
      handleApproval();
      handleUserStakedAmount();
      if (poolInfo.pendingRewardsForUser != undefined) {
        setPendinRewards(poolInfo.pendingRewardsForUser.toFixed(2).toString());
      }
      if (poolInfo.pendingRewardsForUser == undefined) {
        console.log("ahaa");
      }
      setFee(poolInfo.fee);
    }
  }, [poolInfo]);

  const handleApproval = async () => {
    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const PepitaMaster = "0x2675f42eC760f6252660778E97Ee64Da062CE897";

    // Code to check the token allowance
    const lpAbi = [
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    const lpContract = new ethers.Contract(
      basicInfo.lpTokenAddress,
      lpAbi,
      provider
    );
    const approved = await lpContract.allowance(account, PepitaMaster);
    const formatapprove = ethers.utils.formatUnits(approved, 18);

    // Enable Approve contract button, we do this so that when we switch wallets the approve button is reset.
    setIsApproved(false);

    // Check if allowance is more than 0, if > 0 then disable "approve contract" button
    if (parseFloat(formatapprove) > 0) {
      setIsApproved(true);
    }
  };

  const handleUserStakedAmount = () => {
    // Users staked LP
    const usersDeposit = poolInfo.usersDeposit;
    const roundedStakedBalance =
      usersDeposit && typeof usersDeposit.toFixed === "function"
        ? usersDeposit.toFixed(2)
        : 0;
    const abbreviated = numFormatter(roundedStakedBalance);
    setStakedAmount(abbreviated);
  };

  const harvestRewards = async () => {
    if (active) {
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const PepitaMaster = "0x2675f42eC760f6252660778E97Ee64Da062CE897";

      const PepitaMasterABI = [
        {
          inputs: [
            {
              internalType: "contract PepitaToken",
              name: "_PEPI",
              type: "address",
            },
            { internalType: "address", name: "_devaddr", type: "address" },
            { internalType: "address", name: "_feeAddress", type: "address" },
            {
              internalType: "uint256",
              name: "_PepitaPerBlock",
              type: "uint256",
            },
            { internalType: "uint256", name: "_startBlock", type: "uint256" },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "pid",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Deposit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "pid",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "EmergencyWithdraw",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "previousOwner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "newOwner",
              type: "address",
            },
          ],
          name: "OwnershipTransferred",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "user",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "pid",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "Withdraw",
          type: "event",
        },
        {
          inputs: [],
          name: "BONUS_MULTIPLIER",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "PEPI",
          outputs: [
            {
              internalType: "contract PepitaToken",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "PepitaPerBlock",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "_allocPoint", type: "uint256" },
            {
              internalType: "contract IERC20",
              name: "_lpToken",
              type: "address",
            },
            { internalType: "uint16", name: "_depositFeeBP", type: "uint16" },
            { internalType: "bool", name: "_withUpdate", type: "bool" },
          ],
          name: "add",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "_pid", type: "uint256" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
          ],
          name: "deposit",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "_devaddr", type: "address" },
          ],
          name: "dev",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "devaddr",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
          name: "emergencyWithdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "feeAddress",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "_from", type: "uint256" },
            { internalType: "uint256", name: "_to", type: "uint256" },
          ],
          name: "getMultiplier",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "massUpdatePools",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "_pid", type: "uint256" },
            { internalType: "address", name: "_user", type: "address" },
          ],
          name: "pendingChad",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          name: "poolInfo",
          outputs: [
            {
              internalType: "contract IERC20",
              name: "lpToken",
              type: "address",
            },
            { internalType: "uint256", name: "allocPoint", type: "uint256" },
            {
              internalType: "uint256",
              name: "lastRewardBlock",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "accChadPerShare",
              type: "uint256",
            },
            { internalType: "uint16", name: "depositFeeBP", type: "uint16" },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "poolLength",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "renounceOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "_pid", type: "uint256" },
            { internalType: "uint256", name: "_allocPoint", type: "uint256" },
            { internalType: "uint16", name: "_depositFeeBP", type: "uint16" },
            { internalType: "bool", name: "_withUpdate", type: "bool" },
          ],
          name: "set",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "_feeAddress", type: "address" },
          ],
          name: "setFeeAddress",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "startBlock",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalAllocPoint",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "newOwner", type: "address" },
          ],
          name: "transferOwnership",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "_PepitaPerBlock",
              type: "uint256",
            },
          ],
          name: "updateEmissionRate",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [{ internalType: "uint256", name: "_pid", type: "uint256" }],
          name: "updatePool",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "address", name: "", type: "address" },
          ],
          name: "userInfo",
          outputs: [
            { internalType: "uint256", name: "amount", type: "uint256" },
            { internalType: "uint256", name: "rewardDebt", type: "uint256" },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "uint256", name: "_pid", type: "uint256" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      const PepitaMasterContract = new ethers.Contract(
        PepitaMaster,
        PepitaMasterABI,
        provider
      );
      const PepitaMasterWithSigner = PepitaMasterContract.connect(signer);
      let tx = await PepitaMasterWithSigner.deposit(basicInfo.pid, 0);
      setLoading(true);
      tx.wait().then(async () => {
        await poolInfo.updatePool(account, prices);
        setPoolInfo(poolInfo);
        console.log("tx confirmed, updating farms");
        setLoading(false);
      });
    }
  };

  const approveFarm = async () => {
    if (active) {
      // @ts-ignore
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();

      const PepitaMaster = "0x2675f42eC760f6252660778E97Ee64Da062CE897";

      const abi = [
        { inputs: [], stateMutability: "nonpayable", type: "constructor" },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "spender",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "value",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
          ],
          name: "approve",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
          ],
          name: "allowance",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ];
      const address = basicInfo.lpTokenAddress;

      const contract = new ethers.Contract(address, abi, provider);
      const contractWithSigner = contract.connect(signer);
      let tx = await contractWithSigner.approve(
        PepitaMaster,
        ethers.utils.parseEther("10000000")
      );

      tx.wait().then(() => {
        handleApproval();
      });
    }
  };

  const isSet = (value): boolean => {
    const notSetValues = [undefined, null, -1, "-1", "-1.00"];
    return !notSetValues.includes(value);
  };

  return (
    <div tw="flex  flex-col justify-evenly flex-grow md:flex-grow-0 width[330px] md:width[350px] md:height[520px]  border-width[6px] bg-white border-color[#00910E] space-y-2 box-shadow[0px 0px 9px 3px rgba(0,0,0,0.75)] px-4 py-4 rounded-3xl mb-16">
      {/* Farm Logos  */}
      <div tw="flex items-center justify-center">
        <div tw="flex items-center ">
          <img
            tw=""
            src={`/assets/images/farms/` + basicInfo.first + `.svg`}
            alt=""
          />
          <img
            tw="-ml-4"
            src={`/assets/images/farms/` + basicInfo.second + `.svg`}
            alt=""
          />
        </div>
      </div>

      <div tw="flex items-center justify-center space-x-2 text-center text-white text-lg">
        <div tw=" background-color[#00910E] w-32 py-1 px-8 rounded-lg">
          HOT🔥
        </div>
        <div tw=" background-color[#00910E] w-32 py-1  px-8 rounded-lg">
          {isSet(poolInfo.allocationPoints)
            ? poolInfo.allocationPoints + "X"
            : "..."}
        </div>
      </div>
      <span tw="truncate text-blue-700 text-3xl text-center px-2">
        {basicInfo.first}-{basicInfo.second} LP
      </span>

      <div tw="flex flex-col -space-y-2 text-lg">
        <span>APR: {isSet(poolInfo.apr) ? poolInfo.apr + "%" : "loading"}</span>
        <span>EARN: {basicInfo.earn}</span>
        <span>
          DEPOSIT FEE: {isSet(fee) ? fee + "%" : "loading"}
          <br />
        </span>
        <span>TVL: {isSet(poolInfo.tvl) ? "$" + poolInfo.tvl : "loading"}</span>
      </div>

      <span tw="text-blue-700 text-2xl"> {basicInfo.earn} earned</span>

      <div tw="flex justify-between">
        <span id="pepitaEarned" tw="text-xl">
          {isSet(pendingRewards) ? pendingRewards : "loading"}
        </span>
        <div
          onClick={harvestRewards}
          tw=" flex items-center justify-center cursor-pointer text-white text-center border-2 border-color[#00910E] background-color[#00910E] py-1 px-8 rounded-lg hover:(bg-white color[#00910E]) md:border-4"
        >
          Harvest
        </div>
      </div>

      <span tw="text-blue-700 text-xl">
        {" "}
        {basicInfo.first}-{basicInfo.second} LP staked
      </span>

      <div tw="">
        {!isApproved && (
          <div
            onClick={approveFarm}
            tw=" flex items-center justify-center cursor-pointer width[100%] font-size[20px] text-white border-2 border-color[#00910E] background-color[#00910E] py-1  rounded-lg hover:(bg-white color[#00910E]) md:border-4"
          >
            Approve Contract
          </div>
        )}
        {isApproved && (
          <div tw="flex items-center justify-between text-4xl">
            <span>
              {isSet(stakedAmount)
                ? numFormatter(stakedAmount)
                : account
                ? "loading"
                : "connect"}
            </span>
            <div tw="flex text-5xl leading-8 text-left space-x-2 hover:text-black">
              <div
                tw="flex text-white border-4 cursor-pointer border-color[#00910E]  background-color[#00910E] hover:color[#00910E] hover:bg-white py-1 pl-2 pr-3 rounded-lg"
                onClick={() => {
                  setToggle(true);
                  setDepositMode(true);
                }}
              >
                <span>+</span>
              </div>
              <div
                tw="flex text-white border-4 cursor-pointer border-color[#00910E]  background-color[#00910E] hover:color[#00910E] hover:bg-white py-1 pl-2 pr-3 rounded-lg"
                onClick={() => {
                  setToggle(true);
                  setDepositMode(false);
                }}
              >
                <span>-</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Popup toggle={toggle} setToggle={setToggle}>
        <StakeLp
          setToggle={setToggle}
          pool={poolInfo}
          basicInfo={basicInfo}
          isDeposit={depositMode}
          toggle={toggle}
          onStake={updatePoolInfo}
        />
      </Popup>
      <LoadingPopup
        setLoading={setLoading}
        loading={loading}
        message={popupMessage}
      />
    </div>
  );
};

export default Stake;
