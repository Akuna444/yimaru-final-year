import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/">
      <Image
        className="w-[200px] h-fit"
        height={200}
        width={200}
        alt="logo"
        src="/Yimaru_transparent.png"
      />
    </Link>
  );
};
