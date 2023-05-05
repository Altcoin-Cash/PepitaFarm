import tw from "twin.macro";
import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { AltConnector } from "../../connectors/AltConnector";
import { InjectedConnector } from "@web3-react/injected-connector";

const ConnectWallet: React.FC = () => {
  const context = useWeb3React();
  const { connector, activate } = context;
  const [activatingConnector, setActivatingConnector] = useState<
    InjectedConnector | undefined
  >(undefined);

  const currentConnector = AltConnector;

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  const connectWallet = () => {
    setActivatingConnector(currentConnector);
    activate(AltConnector);
  };

  return (
    <div tw=" flex flex-col py-4 bg-white opacity-100 border-4 rounded-xl border-black">
      <span tw="border-b-2 border-black text-center">Connect Wallet</span>
      <div
        onClick={connectWallet}
        tw="flex items-center justify-between border-b-2 cursor-pointer bg-white hover:bg-black hover:text-white border-black p-2"
      >
        <span tw="w-52 leading-5 text-center">Connect Via Metamask</span>
        <img tw="w-12" src="/assets/icons/metamask.svg" alt="" />
      </div>
      {/* <div tw="flex items-center justify-between border-b-2 border-black p-2 cursor-pointer bg-white hover:bg-black hover:text-white">
                <span tw="w-52 leading-5 text-center ">Connect Via Trustwallet</span>
                <img tw="w-12" src="/assets/icons/trustwallet.svg" alt="" />
            </div>
            <div tw="pt-12 pr-2 flex justify-end opacity-30">
                <img tw="w-32" src="/assets/icons/PEPILarge.svg" alt="" />
            </div> */}
    </div>
  );
};

export default ConnectWallet;
