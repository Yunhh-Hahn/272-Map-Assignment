import { useState } from 'react'
import { MapContainer, TileLayer} from "react-leaflet";
import './App.css'

function App() {
  return (
    <>
    <MapContainer center={[49.259065, -122.917980]} zoom={13} className='h-screen w-screen z-0'>
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
    </>
  )
}

export default App
