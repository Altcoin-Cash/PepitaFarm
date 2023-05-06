import tw from "twin.macro";
import Link from "next/link";

function Hero() {
  return (
    <div>
      <div tw="md:flex flex-col items-center hidden">
        <img tw="z-10" src="/assets/images/PEPI2.svg" alt="" />
        <div tw=" flex text-6xl flex-col items-center text-black border-4 cursor-pointer border-black bg-white rounded-3xl px-24 py-8 margin-top[-93px] hover:(background-color[#00910E] text-white)">
          <a href="https://swapin.co/" target="_blank">
            BUY PEPI
          </a>
        </div>
      </div>
      <div tw="flex flex-col space-y-6 width[30%] font-size[28px] leading-6 tracking-tighter text-white z-20 absolute top-16 left-8">
        <h1 tw="text-5xl text-center">TOKENOMICS</h1>
        <span>
          No presale <br />
        </span>
        <span tw="pr-12">
          1 PEPI minted per block. <br />
          Farms have a deposit fee, no withdraw fees!
        </span>
      </div>
      <div tw="flex flex-col space-y-6 width[30%] 2xl:text-3xl text-2xl text-center text-white z-20 absolute top-16 right-8 leading-8 tracking-tighter">
        <h1 tw="text-5xl ">What is PEPI?</h1>

        <span tw="">
          PEPI is a yield farming token rewarding{" "}
          <a href="https://swapin.co/" target="_blank">
            swapin.co
          </a>{" "}
          liquidity providers.
        </span>
      </div>
    </div>
  );
}

export default Hero;
