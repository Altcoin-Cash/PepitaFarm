import Head from "next/head";
import tw from "twin.macro";
import HeroSection from "../components/pages/home/hero";
import Link from "next/link";
import React, { useEffect, useContext } from "react";

import Nav from "../components/nav";
import Button from "../components/button";
import SocialIcon from "../components/social";
import { useWeb3React } from "@web3-react/core";
import FarmsContext from "../context/FarmsContext";
import Pool from "../types/Pool";
import { BetaPopup } from "../components/popup";
import { useState } from "react";

export default function Home() {
  const [toggle, setToggle] = useState(true);

  return (
    <div tw="font-family[Tempest] min-h-screen max-h-screen">
      <Head>
        <title>Pepita Farm</title>
        <meta name="description" content="Brewery Farm" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/assets/fonts/Oswald-Regular.ttf"
          as="font"
          crossOrigin="anonymous"
        />
      </Head>

      <div tw="flex flex-col  ">
        <Nav />
        {/* desktop  */}
        <div tw="hidden md:block">
          <HeroSection />
        </div>
        {/* mobile */}
        <div tw="flex flex-col justify-center items-center space-y-6 md:hidden py-2 px-2">
          <div tw="flex flex-col items-center justify-between">
            <img
              tw="z-10 w-full md:hidden"
              src="/assets/images/PEPILight.svg"
              alt=""
            />
            <div tw=" flex flex-col items-center bg-white text-black rounded-xl py-6 px-2 margin-top[-27px] md:text-white  md:background-color[#00910E] md:rounded-3xl md:px-24 md:py-8 md:margin-top[-44px]">
              <span tw="text-3xl md:text-7xl">WHAT THE F*CK </span>
              <span tw=" font-size[22px] tracking-tighter md:text-5xl">
                DO YOU WANT TO DO TODAY?
              </span>
            </div>
          </div>

          <div tw="flex items-center px-2 space-x-2 ">
            <Button text="DATA" link="/data" />
            <Button text="FARMS" link="/farms" />
            <Button text="ABOUT" link="/pepita" />
          </div>

          <div tw="flex flex-col items-center space-y-2">
            <img tw="w-28" src="/assets/icons/PEPILargeLight.svg" alt="" />
            <div tw="border-2 border-white rounded-xl py-2 px-3 text-3xl text-white hover:(bg-white color[#00910E])">
              <a href="https://swapin.co/dex" target="_blank">
                BUY $PEPI
              </a>
            </div>
          </div>
          <SocialIcon />
        </div>

        <BetaPopup setToggle={setToggle} toggle={toggle} />
      </div>
    </div>
  );
}
