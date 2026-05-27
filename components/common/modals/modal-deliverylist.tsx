"use client"
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

export function ModalDeliveryList({open, onOpenChange, feature}: {open: boolean, onOpenChange: (open: boolean) => void, feature?: any}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-screen">
        <DialogHeader>
          <DialogTitle>External Trigger Modal</DialogTitle>
          <DialogDescription>
            This modal is opened by a button in another component.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p>Put your content here.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}