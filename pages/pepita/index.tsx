import Head from "next/head";
import tw from "twin.macro";
import Nav from "../../components/nav";
import Hero from "../../components/pages/pepita/hero";
import MobHero from "../../components/pages/home/mobhero";
import SocialIcon from "../../components/social";

export default function Home() {
  return (
    <div tw="font-family[Tempest] min-h-screen max-h-screen background-color[#00910E] md:bg-white">
      <Head>
        <title>PEPI | Pepita Farm</title>
        <meta name="description" content="PEPI | Pepita Farm" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/assets/fonts/Oswald-Regular.ttf"
          as="font"
          crossOrigin=""
        />
      </Head>

      <div tw="">
        <Nav />
        <div tw="md:(py-12 px-32) md:bg-gray-300 relative">
          <div tw="md:(px-16 pt-24) md:bg-white rounded-3xl md:shadow-xl">
            <div tw=" pt-8 pb-44 px-8 relative hidden md:block rounded-3xl md:background-color[#00910E]">
              <Hero />
            </div>
            <div tw="flex flex-col w-full md:flex-row items-center justify-around md:(px-4 pt-32 pb-8)">
              <div tw="flex md:(items-center justify-center) pl-4 pr-32 relative">
                <img
                  tw="w-full hidden md:block"
                  src="assets/images/StandingPEPI.svg"
                  alt=""
                />
                <img
                  tw="w-full md:hidden"
                  src="assets/images/StandingPEPILight.svg"
                  alt=""
                />
                <span tw="text-3xl absolute text-white w-44 bottom[10%] text-center right-0 mr-4 md:hidden">
                  lovely Pepita
                </span>
              </div>
              <div tw="flex flex-col items-center px-4 md:(w-2/3 px-0) text-center space-y-8">
                <span tw="text-xl absolute hidden text-white w-36 md:(static md:text-black text-8xl)">
                  lovely Pepita
                </span>
                <div tw="bg-white text-black p-3 md:background-color[#00910E] md:text-white rounded-3xl md:py-12 md:px-4 md:max-width[80%]">
                  <span tw="text-2xl md:font-size[32px] leading-6 ">
                    PEPI is the girlfriend of PEPE!
                  </span>
                </div>
                <div tw="md:flex items-center hidden">
                  <img tw="h-20" src="/assets/images/pepe.png" alt="" />
                </div>
              </div>
            </div>
            <MobHero />
          </div>
          <div tw="absolute right-12 top-20 hidden md:block ">
            <SocialIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
