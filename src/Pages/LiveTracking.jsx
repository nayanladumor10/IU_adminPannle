"use client"

import { useState, useEffect } from "react"
import { MapPin, Navigation, Clock, User, Phone, Car } from "lucide-react"

export default function LiveTracking() {
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Ahmed Khan",
      phone: "+92 300 1234567",
      vehicle: "Toyota Corolla - ABC 123",
      status: "active",
      location: { lat: 24.8607, lng: 67.0011 },
      destination: "Gulshan-e-Iqbal",
      eta: "15 mins",
      tripId: "TRP001",
      passenger: "Sarah Ali",
    },
    {
      id: 2,
      name: "Hassan Ali",
      phone: "+92 301 9876543",
      vehicle: "Honda City - XYZ 789",
      status: "active",
      location: { lat: 24.8615, lng: 67.0025 },
      destination: "DHA Phase 2",
      eta: "8 mins",
      tripId: "TRP002",
      passenger: "Omar Sheikh",
    },
    {
      id: 3,
      name: "Fatima Noor",
      phone: "+92 302 5555555",
      vehicle: "Suzuki Alto - DEF 456",
      status: "idle",
      location: { lat: 24.859, lng: 67.004 },
      destination: null,
      eta: null,
      tripId: null,
      passenger: null,
    },
  ])

  const [selectedDriver, setSelectedDriver] = useState(null)
  const [mapCenter, setMapCenter] = useState({ lat: 24.8607, lng: 67.0011 })

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDrivers((prevDrivers) =>
        prevDrivers.map((driver) => ({
          ...driver,
          location: {
            lat: driver.location.lat + (Math.random() - 0.5) * 0.001,
            lng: driver.location.lng + (Math.random() - 0.5) * 0.001,
          },
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleDriverClick = (driver) => {
    setSelectedDriver(driver)
    setMapCenter(driver.location)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Main content area */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Live Tracking</h2>
          <p className="text-gray-400">Real-time tracking of drivers and ongoing trips</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Map Area */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg border border-gray-700 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10">
              <div className="bg-gray-900 bg-opacity-90 rounded-lg p-3">
                <div className="flex items-center space-x-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live Tracking Active</span>
                </div>
              </div>
            </div>

            {/* Simulated Map */}
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 relative z-10">
              {/* Grid pattern to simulate map */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-8 grid-rows-6 h-full">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div key={i} className="border border-gray-600"></div>
                  ))}
                </div>
              </div>

              {/* Driver markers */}
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
                    selectedDriver?.id === driver.id ? "scale-125" : "hover:scale-110"
                  }`}
                  style={{
                    left: `${((driver.location.lng - 67.0) * 10000) % 100}%`,
                    top: `${((driver.location.lat - 24.86) * 10000) % 100}%`,
                  }}
                  onClick={() => handleDriverClick(driver)}
                >
                  <div className={ ` relative ${driver.status === "active" ? "text-green-400" : "text-gray-400"}`}>
                    <Car className="w-6 h-6" />
                    <div
                      className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                        driver.status === "active" ? "bg-green-400 animate-pulse" : "bg-gray-500"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}

              {/* Map controls */}
              <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                <button className="bg-gray-900 bg-opacity-90 p-2 rounded text-white hover:bg-green-700 transition-colors">
                  <Navigation className="w-4 h-4" />
                </button>
                <button className="bg-gray-900 bg-opacity-90 p-2 rounded text-white hover:bg-green-700 transition-colors">
                  +
                </button>
                <button className="bg-gray-900 bg-opacity-90 p-2 rounded text-white hover:bg-green-700 transition-colors">
                  -
                </button>
              </div>
            </div>
          </div>

          {/* Driver List */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Active Drivers</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">
                  {drivers.filter((d) => d.status === "active").length} Active
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedDriver?.id === driver.id
                      ? "border-green-400 bg-green-400 bg-opacity-10"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                  onClick={() => handleDriverClick(driver)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-white font-medium">{driver.name}</span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs ${
                        driver.status === "active" ? "bg-green-700 text-green-400" : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {driver.status}
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Car className="w-3 h-3" />
                      <span>{driver.vehicle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Phone className="w-3 h-3" />
                      <span>{driver.phone}</span>
                    </div>

                    {driver.status === "active" && (
                      <>
                        <div className="flex items-center space-x-2 text-green-400">
                          <MapPin className="w-3 h-3" />
                          <span>To: {driver.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-green-400">
                          <Clock className="w-3 h-3" />
                          <span>ETA: {driver.eta}</span>
                        </div>
                        <div className="text-gray-400">
                          <span>Passenger: {driver.passenger}</span>
                        </div>
                        <div className="text-gray-400">
                          <span>Trip ID: {driver.tripId}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {driver.status === "active" && (
                    <div className="mt-3 flex space-x-2">
                      <button className="flex-1 bg-green-700 hover:bg-green-600 text-white py-1 px-3 rounded text-xs transition-colors">
                        Track
                      </button>
                      <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1 px-3 rounded text-xs transition-colors">
                        Contact
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trip Statistics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <Car className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Active Trips</p>
                <p className="text-white text-xl font-bold">{drivers.filter((d) => d.status === "active").length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Total Drivers</p>
                <p className="text-white text-xl font-bold">{drivers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Avg ETA</p>
                <p className="text-white text-xl font-bold">12 min</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-gray-400 text-sm">Coverage Area</p>
                <p className="text-white text-xl font-bold">25 km²</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}