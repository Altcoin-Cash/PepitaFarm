import tw from "twin.macro";

function Hero() {
  return (
    <div tw="flex flex-col items-center">
      <img
        tw="z-10 hidden md:block"
        src="/assets/images/pepita_logo.jpg"
        alt=""
      />
      <img tw="z-10 md:hidden" src="/assets/images/PEPILight.svg" alt="" />
      <div tw=" flex flex-col items-center bg-white text-black rounded-xl py-6 px-6 margin-top[-14px] md:text-white  md:background-color[#00910E] md:rounded-3xl md:px-24 md:py-8 md:margin-top[-44px]">
        <span tw="text-2xl md:text-7xl">PEPI FARMS </span>
        <span tw=" text-xl md:text-5xl">PROVIDE LP - EARN $PEPI</span>
      </div>
    </div>
  );
}

export default Hero;
