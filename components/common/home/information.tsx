"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useGetDeliveries } from "@/hooks/use-delivery";
import { useGetStats } from "@/hooks/use-stats";
import { useEffect } from "react";
import { CiDeliveryTruck } from "react-icons/ci";
import { LiaLinkedin } from "react-icons/lia";
import { TbBasketX } from "react-icons/tb";


const getStatusProgress = (status?: string) => {
  if (!status) return 0;
  const s = status.toLowerCase().replace(/\s+/g, '_');
  if (s === 'pending') return 0;
  if (s === 'on_delivery') return 50;
  if (s === 'completed' || s === 'delivered') return 100;
  return 0;
};

const getColorProgress = (status?: string) => {
  if (!status) return 0;
  const s = status.toLowerCase().replace(/\s+/g, '_');
  if (s === 'pending') return "bg-gray-300";
  if (s === 'on_delivery') return "bg-yellow-500";
  if (s === 'completed' || s === 'delivered') return "bg-green-500";
  return 0;
};

export default function Information() {

    const { deliveries, fetchDeliveries, isLoading: isDeliveriesLoading } = useGetDeliveries();
    const { stats, fetchStats, isLoading: isStatsLoading } = useGetStats();

    useEffect(() => {
      // console.log("Modal open:", feature);
      setTimeout(() => {
         fetchDeliveries();
         fetchStats();
      }, 2000);
    }, [fetchDeliveries, fetchStats]);

    return (
        <div>
            <section className="p-8">
              <p className="text-xs font-semibold text-black dark:text-zinc-200">
                Gerard's Portfolio
              </p>
              <p className="text-3xl font-semibold text-zinc-800 dark:text-zinc-200">
                <span className="text-5xl font-semibold text-yellow-500 dark:text-zinc-200">Delivery Tracker</span><br /> Demo
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
                        Total Waypoints
                      </p>
                      <p className="text-2xl font-bold">{stats?.data?.total_locations || 0}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-none bg-yellow-500 text-white relative overflow-hidden">
                    <div className="absolute bg-gray-100/25 rounded-md rotate-45 w-25 h-25 right-0 bottom-0 z-0"></div>
                    <CardContent className="m-0">
                      <p className="text-xs">
                        Total Orders
                      </p>
                      <p className="text-2xl font-bold z-10">{stats?.data?.total_orders || 0}</p>
                    </CardContent>
                  </Card>
              </div>
            </section>
            
            <section className="px-8 py-2 overflow-y-auto" style={{maxHeight: "50vh"}}>
              <p className="text-md font-semibold text-black dark:text-zinc-200 py-2">
                Latest Deliveries
              </p>
              <div className="grid grid-cols-1 md:grid-cols-1 w-full gap-3">
                <div className="flex-1">

                  {isDeliveriesLoading ? 
                    <div>
                      <TbBasketX size={60}/>
                      <p className="p-3 text-sm text-gray-500">Loading deliveries...</p> 
                    </div>
                    : deliveries?.data?.length > 0 ? deliveries.data.map((delivery: any) => (
                      <div key={delivery.id} className="flex flex-col p-6 bg-white border rounded gap-2 my-2">
                        <div className="flex items-center">
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-700">Delivery #{delivery.code}</p>
                          </div>
                          <div className="flex-1 justify-end flex">
                            <CiDeliveryTruck size={35} className="text-blue-800" />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <div className="flex-2">
                              <Progress 
                                value={getStatusProgress(delivery.routes?.[0]?.delivery_status)} 
                                className="w-full bg-blue-500/20" 
                                indicatorClassName={getColorProgress(delivery.routes?.[0]?.delivery_status) + " h-2"}
                              />
                            </div>
                            <div className="flex-1 justify-end flex">
                              <div className="font-semibold max-w-fit items-center gap-1 justify-center text-blue-900 text-[10px] bg-blue-100 py-1 px-2 uppercase rounded-sm">
                                {(delivery.routes?.[0]?.delivery_status || "PENDING").replace(/_/g, " ")}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-blue-900 text-xs py-2">Details:</p>
                          <div className="p-3 border bg-blue-50 rounded-sm">
                              <p className="font-semibold text-xs text-gray-600">Order: #{delivery.order?.code}</p>
                              <p className="font-semibold text-xs text-gray-600">Address: {delivery.routes?.[0]?.delivery_address}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                        <TbBasketX size={60} className="opacity-20" />
                        <p className="mt-2 text-sm font-semibold">No deliveries found</p>
                      </div>
                    )
                  }
                </div>
              </div>
            </section>


        </div>
    )
}