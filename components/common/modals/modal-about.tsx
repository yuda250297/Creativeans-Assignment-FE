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

export function ModalAbout({open, onOpenChange, feature}: {open: boolean, onOpenChange: (open: boolean) => void, feature?: any}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl">
        <DialogHeader>
            <DialogTitle className="text-white">About This Project</DialogTitle>
        </DialogHeader>

        <div className="flex p-5">
            <div className="flex-1">
                <p className="text-lg font-medium text-yellow-600 my-2" style={{"letterSpacing": "1px"}}>PROJECT OVERVIEW</p>
                <p className="font-bold text-5xl" style={{"letterSpacing": "1px"}}>About This Project</p>
            </div>    
            <div className="flex-1">
                <p className="text-2xl font-medium my-2">Techical Foundations</p>
                <div className="flex flex-wrap gap-4 my-4">
                    <div className="w-40 h-40 border rounded-md flex items-center justify-center bg-yellow-400 text-white mb-3">
                        <p className="text-md font-medium">Next.js</p>
                    </div>
                    <div className="w-40 h-40 border rounded-md flex items-center justify-center bg-yellow-400 text-white mb-3">
                        <p className="text-md font-medium">Next.js</p>
                    </div>
                    <div className="w-40 h-40 border rounded-md flex items-center justify-center bg-yellow-400 text-white mb-3">
                        <p className="text-md font-medium">Next.js</p>
                    </div>
                    <div className="w-40 h-40 border rounded-md flex items-center justify-center bg-yellow-400 text-white mb-3">
                        <p className="text-md font-medium">Next.js</p>
                    </div>
                    <div className="w-40 h-40 border rounded-md flex items-center justify-center bg-yellow-400 text-white mb-3">
                        <p className="text-md font-medium">Next.js</p>
                    </div>
                </div>
                
            </div>    
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