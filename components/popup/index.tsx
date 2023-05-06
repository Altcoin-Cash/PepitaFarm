import tw from "twin.macro";

export default function Popup({
  children,
  toggle,
  setToggle,
  showClosed = false,
}) {
  return toggle ? (
    <div tw=" flex items-center background-color[rgba(0, 0, 0, 0.3)] height[100%] inset-0 z-30 width[100%]  justify-center fixed overflow-hidden">
      <div tw="relative ">
        {showClosed && (
          <div
            tw="absolute right-2 top-2 border border-black leading-3 text-center cursor-pointer"
            onClick={() => setToggle(false)}
          >
            X
          </div>
        )}
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
}

export function LoadingPopup({ loading, setLoading, message }) {
  console.log("pop", message);

  return loading ? (
    <div tw="absolute flex  items-center justify-center p-8 inset-0 -top-8 height[100%]  z-30 width[100%]  justify-center ">
      <div tw="relative flex flex-col items-center justify-center w-full bg-black bg-opacity-80 rounded-xl h-full">
        <div
          tw="absolute top-2 right-2 text-white text-3xl p-2  border border-white leading-3 text-center cursor-pointer"
          onClick={() => setLoading(false)}
        >
          X
        </div>
        <img tw="animate-spin" src={`/assets/images/brewery.png`} alt="" />
        <span tw="text-white mt-4 text-2xl animate-bounce">{message}</span>
      </div>
    </div>
  ) : (
    <></>
  );
}

export function TransactionConfirmedPopup({ loading, setLoading }) {
  return loading ? (
    <div tw="absolute flex  items-center justify-center p-8 inset-0 -top-8 height[100%]  z-30 width[100%]  justify-center ">
      <div tw="relative flex flex-col items-center justify-center w-full bg-black bg-opacity-80 rounded-xl h-full">
        <div
          tw="absolute top-2 right-2 text-white text-3xl p-2  border border-white leading-3 text-center cursor-pointer"
          onClick={() => setLoading(false)}
        >
          X
        </div>
        <span tw="text-white mt-4 text-lg text-center">
          Transaction confirmed.
        </span>
        <span tw="text-white mt-4 text-base text-center">
          Please reload page if stats do not update automatically.
        </span>
      </div>
    </div>
  ) : (
    <></>
  );
}

export function WrongNetworkPopup({ loading, setLoading }) {
  return loading ? (
    <div tw="absolute flex  items-center justify-center p-8 inset-0 -top-8 height[150%]  z-30 width[150%]  justify-center ">
      <div tw="relative flex flex-col items-center justify-center w-full bg-black bg-opacity-80 rounded-xl h-full">
        <div
          tw="absolute top-2 right-2 text-white text-3xl p-2  border border-white leading-3 text-center cursor-pointer"
          onClick={() => setLoading(false)}
        >
          X
        </div>
        <img src={`/assets/images/pepitalogo.png`} alt="" />
        <span tw="text-black mt-4 text-3xl ">
          Switch to Altcoinchain Network
        </span>
      </div>
    </div>
  ) : (
    <></>
  );
}

export function BetaPopup({ toggle, setToggle }) {
  return toggle ? (
    <div tw="absolute flex  items-center justify-center p-8 inset-0 -top-8 height[50%]  z-30 width[50%]  justify-center ">
      <div tw="relative flex flex-col items-center justify-center w-full bg-black bg-opacity-80 rounded-xl h-full">
        <div
          tw="absolute top-5 right-5 text-white text-3xl p-2  border border-white leading-3 text-center cursor-pointer"
          onClick={() => setToggle(false)}
        >
          X
        </div>
        <img src={`/assets/images/pepitalogo.png`} alt="" />
        <span tw="text-white mt-6 text-base text-center">
          Website is still in beta phase. Please report bugs in our discord.{" "}
        </span>
        <span tw="text-white mt-4 text-base text-center">
          Proceed at your own risk.
        </span>
      </div>
    </div>
  ) : (
    <></>
  );
}
