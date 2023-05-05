import tw from "twin.macro";
import Link from "next/link";

function Button({ text, link }) {
  return (
    <div tw="border-2 border-white flex justify-center items-center rounded-xl py-2 px-3 text-2xl text-white hover:(bg-white color[#00910E])">
      <Link href={link}>{text}</Link>
    </div>
  );
}

export default Button;
