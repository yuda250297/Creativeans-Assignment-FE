"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LiaLinkedin } from "react-icons/lia";

export default function Information() {
    return (
        <div>
            <section className="p-8">
              <p className="text-xs font-semibold text-black dark:text-zinc-200">
                Gerard's Portfolio
              </p>
              <p className="text-3xl font-semibold text-zinc-800 dark:text-zinc-200">
                <span className="text-5xl font-semibold text-yellow-500 dark:text-zinc-200">Delivery Tracker</span> Demo
              </p>
            </section>

            <section className="bg-zinc-50 min-h-10 max-h-10 flex items-center justify-end px-4">
              <Button variant="link" className="cursor-pointer p-0 max-h-6 rounded" size={"sm"} style={{fontSize:"0.7rem"}}>
                <LiaLinkedin className="bg-blue-900 text-white cursor-pointer p-0 rounded" size={25}/> Visit My LinkedIn
              </Button>
            </section>


            <section className="px-8 py-2">
              <p className="text-md font-semibold text-black dark:text-zinc-200 py-2">
                Fleet overview
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-3">
                  <Card className="shadow-none pb-0 bg-yellow-400 text-white relative overflow-hidden">
                    <div className="absolute bg-gray-100/25 rounded-md rotate-45 w-25 h-25 right-0 bottom-0 z-0"></div>
                    <CardContent className="pb-0 z-10">
                      <p className="text-xs">
                        Active Routes
                      </p>
                      <p className="text-2xl font-bold">8</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-none bg-yellow-500 text-white relative overflow-hidden">
                    <div className="absolute bg-gray-100/25 rounded-md rotate-45 w-25 h-25 right-0 bottom-0 z-0"></div>
                    <CardContent className="m-0">
                      <p className="text-xs">
                        Total km
                      </p>
                      <p className="text-2xl font-bold z-10">120</p>
                    </CardContent>
                  </Card>
              </div>
            </section>
            
            <section className="px-8 py-2">
              <p className="text-md font-semibold text-black dark:text-zinc-200 py-2">
                Latest Deliveries
              </p>
              <div className="grid grid-cols-1 md:grid-cols-1 w-full gap-3">
                  <Card className="shadow-none">
                    <CardContent className="pb-0">
                      <p className="text-xs text-zinc-800 dark:text-zinc-200">
                        Active Routes
                      </p>
                      <p className="text-2xl font-bold">8</p>
                    </CardContent>
                    <Separator />
                    <CardContent className="py-0">
                      <p className="text-xs text-zinc-800 dark:text-zinc-200">
                        Active Routes
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-none">
                    <CardContent className="m-0">
                      <p className="text-xs text-zinc-800 dark:text-zinc-200">
                        Total km
                      </p>
                      <p className="text-2xl font-bold">120</p>
                    </CardContent>
                  </Card>
              </div>
            </section>

        </div>
    )
}