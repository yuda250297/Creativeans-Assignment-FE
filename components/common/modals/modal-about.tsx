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
                <p className="text-gray-800 my-5 text-sm">
                  This is a simple Next.js application that demonstrates simplified Delivery Tracking functionality.
                </p>
                <p className="text-gray-800 my-5 text-sm">Key Features:</p>
                <ol className="text-gray-800 text-sm">
                    <li>Real-time Order Management: Track orders through distinct statuses (Pending, Processing, In-Transit, Delivered).</li>
                    <li>Location Awareness: Map-based visualization of key facilities, including container terminals, regional warehouses, and retail stores.</li>
                </ol>
                <a className="inline-block mt-8 rounded-none bg-black text-white px-8 py-3" href="https://bucket.gerard-portfolio.com/cv/CV-GERARDUS-YUDA-ISWARA-MAY2026.pdf" target="_blank">
                  View My CV
                </a>
            </div>    
            <div className="flex-1">
                <p className="text-2xl font-medium my-2">Techical Foundations</p>
                <div className="flex flex-wrap gap-4 my-4">
                    <div className="w-40 h-40 border flex items-center justify-center bg-black text-white">
                        <p className="text-md font-medium">Next.js</p>
                    </div>
                    <div className="w-40 h-40 border flex items-center justify-center bg-blue-400 text-white">
                        <p className="text-md font-medium">Fiber (GO)</p>
                    </div>
                    <div className="w-40 h-40 border flex items-center justify-center bg-green-700 text-white">
                        <p className="text-md font-medium">MongoDB</p>
                    </div>
                    <div className="w-40 h-40 border flex items-center justify-center bg-blue-900 text-white">
                        <p className="text-md font-medium">Docker</p>
                    </div>
                    <div className="w-40 h-40 border flex items-center justify-center bg-slate-600 text-white">
                        <p className="text-md font-medium">Mapbox</p>
                    </div>
                    
                </div>
                
            </div>    
        </div>


        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}