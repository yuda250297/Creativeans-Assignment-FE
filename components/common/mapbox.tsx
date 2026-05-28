"use client"; // if using Next.js 13+ app router

import {useEffect, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {Button} from "../ui/button";
import { TbTruckDelivery } from "react-icons/tb";
import {FaMapMarkerAlt} from "react-icons/fa";
import {BsPinMap} from "react-icons/bs";
import {GrInfo} from "react-icons/gr";
import {createRoot} from "react-dom/client";
import {PopupContent} from "./map/waypoint-popup";
import Navbar from "./map/navbar";
import {useGetLocations} from "@/hooks/use-location";
import { useGetDeliveries } from "@/hooks/use-delivery";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string;

interface Coordinates {
    lng : number;
    lat : number;
}

interface MapProps {
    routeData?: any;
    origin?: Coordinates;
    destination?: Coordinates;
    onRouteLoaded?: (route : any) => void;
}

export default function Map({routeData, origin, destination, onRouteLoaded} : MapProps) {
    const mapContainer = useRef < HTMLDivElement | null > (null);
    const map = useRef < mapboxgl.Map | null > (null);
    const [loading,
        setLoading] = useState(false);
    const [fetchedRoute,
        setFetchedRoute] = useState < any > (null);
    const markerImageRef = useRef < HTMLImageElement | null > (null);
    const waypointMarkersRef = useRef<mapboxgl.Marker[]>([]);

    // Lift the hook here to share state with the Navbar child
    const { locations, fetchLocations, isLoading: isLocationsLoading } = useGetLocations();

    // Fetch directions from Mapbox Directions API
    const fetchDirections = async(start : Coordinates, end : Coordinates) => {
        setLoading(true);
        try {
            const query = await fetch(`https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?steps=true&geometries=geojson&overview=full&access_token=${mapboxgl.accessToken}`);
            const data = await query.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const geojson = {
                    type: "Feature" as const,
                        geometry: route.geometry,
                        properties: {
                            distance: route.distance,
                            duration: route.duration
                        }
                    };
                    setFetchedRoute(geojson);
                    onRouteLoaded
                        ?.(geojson);
                    return geojson;
                } else {
                    console.error("No routes found");
                    return null;
                }
            } catch (error) {
                console.error("Error fetching directions:", error);
                return null;
            } finally {
                setLoading(false);
            }
        };

        // Used for "Start Delivery Tracking" button - can be extended to fetch
        // real-time updates
        const handleLoadDirections = async() => {
            if (!origin || !destination) 
                return;
            await fetchDirections(origin, destination);
        };

        // Initialize map once
        useEffect(() => {
            if (map.current) 
                return;
            
            // Pre-load the marker image
            if (!markerImageRef.current) {
                markerImageRef.current = new Image();
                markerImageRef.current.src = "/map-marker.svg";
            }

            map.current = new mapboxgl.Map({
                container: mapContainer.current !,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [
                    106.8456, -6.2088
                ], // Jakarta coords as default
                zoom: 12,
                pitch: 45
            });

            map
                .current
                .addControl(new mapboxgl.NavigationControl(), "top-right");
            map
                .current
                .addControl(new mapboxgl.FullscreenControl(), "top-right");
            map
                .current
                .addControl(new mapboxgl.ScaleControl({unit: "metric"}), "bottom-right");
            map
                .current
                .addControl(new mapboxgl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                }), "top-right");
        }, []);

        // Handle route data updates (from fetchDirections)
        useEffect(() => {
            if (!map.current || !fetchedRoute) 
                return;
            
            const addRoute = () => {
                // Remove existing source if it exists
                if (map.current !.getSource("route")) {
                    map.current !.removeLayer("route");
                    map.current !.removeSource("route");
                }

                map.current !.addSource("route", {
                    type: "geojson",
                    data: fetchedRoute,
                    lineMetrics: true
                });

                map.current !.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    paint: {
                        "line-width": 4,
                        "line-gradient": [
                            "interpolate",
                            ["linear"],
                            ["line-progress"],
                            0,
                            "#020024",
                            1,
                            "#090979"
                        ]
                    }
                });
            };

            if (map.current.loaded()) {
                addRoute();
            } else {
                map
                    .current
                    .once("load", addRoute);
            }
        }, [fetchedRoute]);

        // Handle external routeData prop
        useEffect(() => {
          if (!map.current || !locations?.data) return;

          console.log("Received routeData:", routeData);
          console.log("Received locations:", locations.data);

          // Ensure the map is ready
          if (!map.current.isStyleLoaded()) {
            map.current.once("style.load", () => {
              addMarkers(locations.data);
            });
          } else {
            addMarkers(locations.data);
          }
        }, [routeData, locations]);

        function addMarkers(data: any) {
          // Clear existing waypoint markers to prevent stacking on re-fetch
          waypointMarkersRef.current.forEach(marker => marker.remove());
          waypointMarkersRef.current = [];

          data.features.forEach((feature: any) => {
            const coords = feature.geometry.coordinates;
            const start = coords;

            const el = document.createElement("img");
            el.src = "/map-marker.svg";
            el.style.width = "40px";
            el.style.height = "40px";
            el.className = "direction-marker";

            const marker = new mapboxgl.Marker(el).setLngLat(start).addTo(map.current!);
            waypointMarkersRef.current.push(marker);

            const popupNode = document.createElement("div");
            const root = createRoot(popupNode);
            root.render(
              <PopupContent 
                store_id={feature.properties.location_id}
                feature={feature}
                title={feature.properties.name} 
                type={feature.properties.location_type} 
                picture={feature.properties.picture_url} 
              />
            );

            const popup = new mapboxgl.Popup({
              offset: 25,
              closeButton: false,   // hides the X button
              closeOnClick: false,  // prevents closing when clicking elsewhere on the map
            })
            .setDOMContent(popupNode);
            marker.setPopup(popup).togglePopup();

            // const el2 = document.createElement("img");
            // el2.src = "/map-marker.svg";
            // el2.style.width = "40px";
            // el2.style.height = "40px";
            // el2.className = "direction-marker";
            // new mapboxgl.Marker(el2).setLngLat(end).addTo(map.current!);
          });
        }


        // Add markers for origin and destination
        // useEffect(() => {
        //     if (!map.current || !origin || !destination) 
        //         return;
            
        //     const addMarkers = () => {

        //         // Add origin marker
        //         const originEl = document.createElement("img");
        //         originEl.src = "/map-marker.svg";
        //         originEl.style.width = "40px";
        //         originEl.style.height = "40px";
        //         // originEl.style.filter = "hue-rotate(120deg)";
        //         originEl.className = "direction-marker";

        //         const addOriginMarker = () => {
        //             new mapboxgl
        //                 .Marker(originEl)
        //                 .setLngLat([origin.lng, origin.lat])
        //                 .addTo(map.current !);
        //         };

        //         if (originEl.complete) {
        //             addOriginMarker();
        //         } else {
        //             originEl.onload = addOriginMarker;
        //         }

        //         // Add destination marker
        //         const destEl = document.createElement("img");
        //         destEl.src = "/map-marker.svg";
        //         destEl.style.width = "40px";
        //         destEl.style.height = "40px";
        //         destEl.className = "direction-marker";

        //         const addDestMarker = () => {
        //             new mapboxgl
        //                 .Marker(destEl)
        //                 .setLngLat([destination.lng, destination.lat])
        //                 .addTo(map.current !);
        //         };

        //         if (destEl.complete) {
        //             addDestMarker();
        //         } else {
        //             destEl.onload = addDestMarker;
        //         }

        //         // Fit map bounds to include both markers
        //         const bounds = new mapboxgl.LngLatBounds([
        //             origin.lng, origin.lat
        //         ], [destination.lng, destination.lat]);
        //         map.current !.fitBounds(bounds, {
        //             padding: 100,
        //             maxZoom: 15,
        //             pitch: 45
        //         });
        //     };

        //     if (map.current.loaded()) {
        //         addMarkers();
        //     } else {
        //         map
        //             .current
        //             .once("load", addMarkers);
        //     }
        // }, [origin, destination]);

        return (
            <div
                className="h-[calc(100vh-2rem)]"
                style={{
                position: "relative",
                width: "100%"
            }}>
                <div
                    ref={mapContainer}
                    className="rounded-xl rounded-tr-none rounded-br-none"
                    style={{
                    width: "100%",
                    height: "100%"
                }}>

                    <Navbar 
                        onLoadDirections={handleLoadDirections} 
                        isDirectionsLoading={loading} 
                        onFetchLocations={fetchLocations}
                        isLocationsLoading={isLocationsLoading}
                    />

                </div>
            </div>
        );
    }
