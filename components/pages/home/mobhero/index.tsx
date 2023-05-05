import tw from "twin.macro";
import SocialIcon from "../../../social";

function MobHero() {
  return (
    <div tw="flex flex-col space-y-8 background-color[#00910E] px-4 py-8 md:hidden">
      <div tw="flex flex-col space-y-6 2xl:text-3xl text-xl text-center text-white  leading-8 tracking-tighter">
        <h1 tw="text-3xl ">What is PEPI?</h1>

        <span tw="">
          PEPI is a yield farming token created to help provide liquidity to
          other meme tokens, a launch pad, and support farming pools for new
          projects.
        </span>
      </div>

      <img tw="h-24" src="/assets/images/pepita.png" alt="" />

      <div tw="flex flex-col space-y-6 text-2xl leading-6 tracking-tighter text-white ">
        <h1 tw="text-3xl text-center">TOKENOMICS</h1>
        <span>
          0 pre-sale <br /> 30,000 start liquidity <br /> 20,000 marketing & dev
          fund <br /> 10,000 airdrop
        </span>
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
