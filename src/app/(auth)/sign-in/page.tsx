import { StyledBackground } from "@/constants";
import { SignInForm } from "./_components/form";
import Image from "next/image";

export default function Page() {
  return (
    <div className='grid grid-cols-2'>
      <Image src={StyledBackground} alt="Styled background" width={100} height={100} className="w-full object-cover h-[600px]" />
      <SignInForm />
    </div>
  )
}