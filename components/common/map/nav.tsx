import { Button } from "@/components/ui/button";
import { BsPinMap } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GrInfo } from "react-icons/gr";
import { TbTruckDelivery } from "react-icons/tb";

interface NavbarProps {
    onLoadDirections: () => Promise<void>;
    isDirectionsLoading: boolean;
    onFetchLocations: (params: any) => void;
    isLocationsLoading: boolean;
}

export default function Navbar({ onLoadDirections, isDirectionsLoading, onFetchLocations, isLocationsLoading }: NavbarProps) {
    
    return (
        <nav
            className="absolute top-1 my-2 mx-3 z-10 rounded-lg bg-white shadow-md h-16 w-[calc(100%-4rem)] flex items-center gap-2 px-2">
            <img src="/brand.jpg" alt="Mapbox Logo" width={50} height={40}/>
            <Button
                className="h-full border-0 shadow-none text-sm cursor-pointer disabled:opacity-50 font-semibold"
                variant={"outline"}
                style={{
                letterSpacing: "3%"
            }}
                onClick={() => onFetchLocations({geo_json: "true"})}
                disabled={isLocationsLoading}><FaMapMarkerAlt/>
                Load all waypoints</Button>
            <Button
                className="h-full border-0 shadow-none text-sm cursor-pointer font-semibold"
                variant={"outline"}
                style={{
                letterSpacing: "3%"
            }}
                onClick={onLoadDirections}
                disabled={isDirectionsLoading}>
                <TbTruckDelivery />{isDirectionsLoading
                    ? "Loading..."
                    : `Start Delivery Tracking`}
            </Button>
            <Button
                className="h-full border-0 shadow-none text-sm cursor-pointer font-semibold"
                variant={"outline"}
                style={{
                letterSpacing: "3%"
            }}><BsPinMap/>Toggle popover detail</Button>
            <Button
                className="h-full border-0 shadow-none text-sm cursor-pointer font-semibold"
                variant={"outline"}
                style={{
                letterSpacing: "3%"
            }}><GrInfo/>About this project</Button>

        </nav>
    )
}