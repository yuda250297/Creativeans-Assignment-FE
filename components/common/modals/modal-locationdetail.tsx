import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DataTable as BaseDataTable, DragHandle } from "@/components/ui/data-table";
import { z } from "zod";
import { useGetDeliveries } from "@/hooks/use-delivery"; // Assuming this hook exists
import { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import { Separator } from "@/components/ui/separator"
import { FiMapPin } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GrDocumentConfig } from "react-icons/gr";
import { TbChecklist } from "react-icons/tb";
import { FaBox } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import { CiDeliveryTruck } from "react-icons/ci";
import { useGetOrders } from "@/hooks/use-order";
import { useGetLocations } from "@/hooks/use-location";
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
  if (!status) return "bg-gray-200";
  const s = status.toLowerCase().replace(/\s+/g, '_');
  if (s === 'pending') return "bg-gray-300";
  if (s === 'on_delivery') return "bg-yellow-500";
  if (s === 'completed' || s === 'delivered') return "bg-green-500";
  return "bg-gray-200";
};

export function ModalLocationDetail({open, onOpenChange, feature}: {open: boolean, onOpenChange: (open: boolean) => void, feature?: any}) {
  // Call your hook here
  const { locations, fetchLocations, isLoading: isLocationsLoading } = useGetLocations();
  const { orders, fetchOrders, isLoading: isOrdersLoading } = useGetOrders();
  const { deliveries, fetchDeliveries, isLoading: isDeliveriesLoading } = useGetDeliveries();

  const location = locations?.data?.[0];

  // Fetch data when modal opens and feature is available
  useEffect(() => {
    console.log("Modal open:", feature);
    if (open && feature) {
      fetchLocations({ _id: feature.properties?.location_id });
      fetchOrders({ location_id: feature.properties?.location_id });
      fetchDeliveries({ location_id: feature.properties?.location_id });
    }
  }, [open, feature, fetchDeliveries, fetchLocations, fetchOrders]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-8xl bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold text-yellow-500">Delivery Tracking</DialogTitle>
          <DialogDescription className="text-black dark:text-zinc-200">
            This modal is opened by a button in another component.
          </DialogDescription>
        </DialogHeader>

        {/* <div className="py-4">
            {isLoading ? <p>Loading deliveries...</p> : 
            <BaseDataTable 
              columns={columns} 
              data={mappedDeliveries} 
              getRowId={(row) => row.id} 
              onRowClick={(row)=>console.log('row clicked', row)}
            />}
        </div> */}
        <div className="flex">

          {/* Location Column */}
          <div className="relative flex-1 p-6 bg-white border">
            {isLocationsLoading ? <p className="text-sm text-gray-500">Loading location...</p> : 
            <div className="bg-white">
              {/* <div className="absolute inset-0 z-30 aspect-video bg-black/35" /> */}
              <img
                src={location?.picture_url}
                alt="Event cover"
                className="relative z-20 aspect-video w-full brightness-80 dark:brightness-40 rounded-lg"
              />
              <div className="py-4">
                <p className="text-2xl font-bold text-blue-900">{location?.name}</p>
                <p className="font-semibold text-gray-500 text-sm"><span className="capitalize">{location?.location_type}</span> ID: #{location?.code}</p>
              </div>
              <Separator className="my-1" />
              <div className="flex items-center py-2">
                <div className="flex-1">
                  <FiMapPin size={25} className="text-yellow-500"/>
                </div>
                <div className="flex-6">
                  <p className="font-bold text-gray-700">Address:</p>
                  <p className="font-semibold text-gray-500 text-sm">{location?.address}</p>
                </div>
              </div>
              <div className="flex items-center py-2">
                <div className="flex-1">
                  <FaMapMarkedAlt size={25} className="text-yellow-500" />
                </div>
                <div className="flex-6">
                  <p className="font-bold text-gray-700">Location:</p>
                  <p className="font-semibold text-gray-500 text-sm">{location?.longitude}, {location?.latitude}</p>
                </div>
              </div>
              <div className="flex items-center py-2">
                <div className="flex-1">
                  <GrDocumentConfig size={25} className="text-yellow-500" />
                </div>
                <div className="flex-6">
                  <p className="font-bold text-gray-700">Type:</p>
                  <p className="font-semibold text-gray-500 text-sm">{location?.location_type}</p>
                </div>
              </div>
            </div>}
          </div>

          {/* Order Column */}
          <div className="flex-1 p-6 border bg-blue-50">
            <div className="flex items-center py-2">
              <div className="flex-1">
                <p className="text-xl font-bold text-blue-900">Orders & Items</p>
              </div>
              <div className="flex-1">

              </div>
            </div>

            <div className="overflow-y-auto max-h-[60vh]">
            {isOrdersLoading ? 
              <div>
                <TbBasketX size={60}/>
                <p className="p-3 text-sm text-gray-500">Loading orders...</p> 
              </div>
              : orders?.data?.length > 0 ? orders.data.map((order: any) => (
                <div key={order.id} className="flex flex-col p-3 border rounded gap-2 my-2 bg-white">
                  <div>
                    <p className="text-sm font-bold text-gray-700">Order #{order.code}</p>
                  </div>
                  <div>
                    <div className="flex items-center">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-500 text-sm">Customer: {order.customer?.name || "General Customer"}</p>
                      </div>
                      <div className="flex-1 justify-end flex">
                        <div className="font-semibold max-w-fit px-3 items-center gap-1 justify-center bg-blue-900 text-white uppercase text-[10px] rounded-sm py-0.5">
                          {order.status ? `ORDER ${order.status}` : "ORDER PAID"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-500 text-xs py-2">Items:</p>
                    {order.items?.length > 0 ? order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex p-2 border bg-gray-50 mb-1 last:mb-0 rounded-sm">
                        <div className="flex flex-1 items-center">
                          <FaBox size={12} className="text-yellow-500" />
                        </div>
                        <div className="flex-5">
                          <p className="font-semibold text-xs">{item.name}</p>
                        </div>
                        <div className="flex-1 text-right text-xs">
                          x {item.quantity}
                        </div>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-4 text-gray-400 bg-gray-50/50 rounded-sm border border-dashed">
                        <TbBasketX size={24} />
                        <p className="text-[10px] mt-1 font-medium text-gray-500">No items available</p>
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <TbBasketX size={60} className="opacity-20" />
                  <p className="mt-2 text-sm font-semibold">No orders found</p>
                </div>
              )
            }
            </div>

          </div>

          {/* Deliveries Column */}
          <div className="flex-1 bg-white p-6 border">
            <div className="flex items-center py-2">
              <div className="flex-1">
                <p className="text-xl font-bold text-blue-900">Deliveries</p>
              </div>
              <div className="flex-1">
            
              </div>
            </div>

            {isDeliveriesLoading ? 
              <div>
                <TbBasketX size={60}/>
                <p className="p-3 text-sm text-gray-500">Loading deliveries...</p> 
              </div>
              : deliveries?.data?.length > 0 ? deliveries.data.map((delivery: any) => (
                <div key={delivery.id} className="flex flex-col p-3 border rounded gap-2 my-2">
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

        <DialogFooter>
          {/* <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button> */}
          {/* <Button className="bg-yellow-500 hover:bg-yellow-600">Confirm</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
