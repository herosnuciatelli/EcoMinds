import { StyledBackground } from "@/constants";
import { SignInForm } from "./_components/form";
import Image from "next/image";

export default function Page() {
  return (
    <div className='grid md:grid-cols-2 py-24 md:py-0'>
      <Image src={StyledBackground} alt="Styled background" width={100} height={100} className="w-full object-cover hidden h-[600px] md:block" />
      <SignInForm />
    </div>
  )
}