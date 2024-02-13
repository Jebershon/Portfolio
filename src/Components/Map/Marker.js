import L from "leaflet";
import React, { useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import ".//leaflet.css";
import osm from "./osm-providers";

const markerIcon = new L.Icon({
  iconUrl: require("./Marker.png"),
  iconSize: [40, 45],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
});

function MarkersMap(){
  const [center, setCenter] = useState({ lat: 11.044460, lng: 76.927197 });
  const ZOOM_LEVEL = 9;
  const mapRef = useRef();

  return (
    <>
      <div className="row">
        <div className="col text-center">
          <div className="col">
            <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
              <TileLayer
                url={osm.maptiler.url}
                attribution={osm.maptiler.attribution}
              />
                <Marker
                  position={[11.044460, 76.927197]}
                  icon={markerIcon}
                >
                  <Popup>
                    <b>
                      House no:11,Silver Nagar,Tvs Nagar,Coimbatore,TN 641025...
                      <a href="https://www.google.com/maps/place/EB+Colony,+TVS+Nagar,+Coimbatore,+Tamil+Nadu+641025/@11.0443506,76.9262945,18z/data=!3m1!4b1!4m6!3m5!1s0x3ba858b033857fe5:0x1e95b6ba0dc320fd!8m2!3d11.044349!4d76.9270749!16s%2Fg%2F11c62p1hhs?entry=ttu">click me..</a>
                    </b>
                  </Popup>
                </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default MarkersMap;