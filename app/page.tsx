"use client";

import Information from "@/components/common/home/information";
import Map from "@/components/common/mapbox";
import ModalContainer from "@/components/common/modals/modalcontainer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

let json = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [106.915, -6.121],
          [106.845, -6.2]
        ]
      },
      "properties": {
        "from": "Port",
        "to": "Warehouse"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [108.8, -6.121],
          [106.845, -6.3]
        ]
      },
      "properties": {
        "from": "Port",
        "to": "Warehouse"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [109.915, -6.121],
          [106.8, -6.215]
        ]
      },
      "properties": {
        "from": "Port",
        "to": "Warehouse"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [99.015, -8.121],
          [106.8, -6.215]
        ]
      },
      "properties": {
        "from": "Airport",
        "to": "Warehouse"
      }
    }
  ]
}

let origin = {
  "lng": 106.921518,
  "lat": -6.094259,
}

let end = {
  "lng": 106.735308,
  "lat": -6.126327
}

export default function Home() {
  return (
    <div className="flex h-screen box-border items-center justify-center bg-white font-sans dark:bg-black p-4">
      <main className="flex min-h-[calc(100vh-2rem)] w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full">
          <div className="col-span-2">
            <Map routeData={json} origin={origin} destination={end}/>
          </div>
          <div className="col-span-1 p-0 bg-zinc-100 rounded-e-xl">
            <Information />
            <ModalContainer />
          </div>
        </div>
      </main>
    </div>
  );
}
