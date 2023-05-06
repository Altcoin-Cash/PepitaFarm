import tw from "twin.macro";
import SocialIcon from "../../../social";

function MobHero() {
  return (
    <div tw="flex flex-col space-y-8 background-color[#00910E] px-4 py-8 md:hidden">
      <div tw="flex flex-col space-y-6 2xl:text-3xl text-xl text-center text-white  leading-8 tracking-tighter">
        <h1 tw="text-3xl ">What is PEPI?</h1>

        <span tw="">
          PEPI is a yield farming meme token created to help provide liquidity
          to other project, launch pad, and support farming pools for new
          projects.
        </span>
      </div>

      <img tw="h-24" src="/assets/images/pepita.png" alt="" />

      <div tw="flex flex-col space-y-6 text-2xl leading-6 tracking-tighter text-white ">
        <h1 tw="text-3xl text-center">TOKENOMICS</h1>
        <span>No presale.</span>
        <span tw="pr-8">
          1 PEPI minted per block. <br />
          Farms have a deposit fee, no withdraw fees!
        </span>
      </div>
      <SocialIcon />
    </div>
  );
}

export default MobHero;
