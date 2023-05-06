import tw from "twin.macro";
import Link from "next/link";
import { useRouter } from "next/router";
import { navdata } from "./nav.data";
import Logo from "../logo";
import Back from "../back";
import Popup from "../popup";
import ConnectWallet from "../connectwallet";

import { useWeb3React } from "@web3-react/core";
import { useState, useEffect } from "react";
import { useEagerConnect } from "../../hooks/useEagerConnect";

function Nav() {
  const router = useRouter();
  const path = router.asPath;
  const [toggle, setToggle] = useState(false);
  const [address, setAddress] = useState("");

  const { account } = useWeb3React();
  useEagerConnect();

  useEffect(() => {
    if (account) {
      const shortAddress =
        account.substring(0, 4) + ".." + account.substring(39);
      setAddress(shortAddress);
    } else if (!account && address.length > 0) {
      setAddress("");
    }
  }, [account]);

  return (
    <div tw="flex justify-between items-center background-color[#00910E] font-family[Tempest] text-2xl px-4 md:px-8 py-1">
      <div tw="hidden md:block">
        <Logo />
      </div>

      <div tw="flex items-center ">
        <div tw="flex items-center space-x-4 text-white text-2xl ">
          {navdata.map((item, index) => (
            <div tw="md:flex hidden" key={index}>
              <Link tw="" href={item.tag}>
                <span
                  css={[
                    tw`cursor-pointer`,
                    path == item.tag && tw`text-gray-900`,
                  ]}
                >
                  {item.title}
                </span>
              </Link>
            </div>
          ))}
          <div
            tw="border hover:bg-gray-900 border-white border-solid rounded-lg px-6 text-center text-base cursor-pointer"
            onClick={() => setToggle(true)}
          >
            <span tw="text-white text-xl md:text-4xl">
              {address ? address : "Connect"}
            </span>
          </div>
        </div>
      </div>

      <Popup toggle={toggle} setToggle={setToggle} showClosed={true}>
        <ConnectWallet />
      </Popup>
    </div>
  );
}

export default Nav;
