"use client";
import Image from "next/image";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";
export default function Page() {
    const currentTheme = useCurrentTheme()
  return (
    <div className="flex items-center justify-center w-full px- py-8">
      <div className="max-w-5xl w-full">
        <section className="space-y-8 flex flex-col items-center">
          <div className="flex flex-col items-center mt-4">
            <Image
              src={"/half_logo.svg"}
              width={60}
              alt="logo"
              height={60}
              className="hidden md:block"
            />
          </div>
          <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
          <p className="text-muted-foreground text-center text-sm md:text-base">
            Choose the plan fits your needs
          </p>
          <PricingTable appearance={
            {
                baseTheme:currentTheme ==="dark"?dark:undefined,
                elements:{
                    pricingTableCard:"border! shadow-none! rounded-lg!"
                }
            }
          }/>
        </section>
      </div>
    </div>
  );
}
