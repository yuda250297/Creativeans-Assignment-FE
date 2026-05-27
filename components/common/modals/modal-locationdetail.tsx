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

export const schema = z.object({
  id: z.number(),
  delivery_code: z.string(),
  order_code: z.string(),
  store_code: z.string(),
  store_name: z.string(),
  destination_address: z.string(),
  updated_at: z.string(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: "delivery_code",
    header: "Delivery Code",
    cell: ({ row }) => row.original.delivery_code
  },
  {
    accessorKey: "order_code",
    header: "Order Code",
    cell: ({ row }) => row.original.order_code
  },
  {
    accessorKey: "store_code",
    header: "Store Code",
    cell: ({ row }) => row.original.store_code
  },
  {
    accessorKey: "store_name",
    header: "Store Name",
    cell: ({ row }) => row.original.store_name
  },
  {
    accessorKey: "destination_address",
    header: "Delivery Address",
    cell: ({ row }) => row.original.destination_address
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => row.original.updated_at
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="default" className="w-full rounded text-xs cursor-pointer bg-yellow-500">
          Track route
      </Button>
    )
  }
];

export function ModalLocationDetail({open, onOpenChange, feature}: {open: boolean, onOpenChange: (open: boolean) => void, feature?: any}) {
  // Call your hook here
  const { deliveries, fetchDeliveries, isLoading } = useGetDeliveries();

  // Map the API fields to match your internal Zod schema and DataTable columns
  const mappedDeliveries = useMemo(() => {
    return (deliveries?.data || []).map((item: any) => ({
      id: item.id,
      delivery_code: item.code || item.delivery_code, // Example: mapping 'code' to 'delivery_code'
      order_code: item.order.code || item.order_id,
      store_code: item.store_id || item.routes[0].origin_location.code,
      store_name: item.store?.name || item.routes[0].origin_location.name,
      destination_address: item.address || item.routes[0].delivery_address,
      updated_at: item.updated_at || item.timestamp,
    }));
  }, [deliveries]);

  // Fetch data when modal opens and feature is available
  useEffect(() => {
    if (open && feature) {
      fetchDeliveries({ store_code: feature.properties?.store_code });
    }
  }, [open, feature, fetchDeliveries]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-4xl font-bold text-yellow-500">Delivery Tracking</DialogTitle>
          <DialogDescription className="text-black dark:text-zinc-200">
            This modal is opened by a button in another component.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
            {isLoading ? <p>Loading deliveries...</p> : 
            <BaseDataTable 
              columns={columns} 
              data={mappedDeliveries} 
              getRowId={(row) => row.id} 
              onRowClick={(row)=>console.log('row clicked', row)}
            />}
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
