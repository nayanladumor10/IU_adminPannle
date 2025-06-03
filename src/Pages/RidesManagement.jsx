import { useState, useEffect, useRef, useCallback } from "react"

// Mock API functions
const api = {
  getRides: async (status) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    const allRides = [
      {
        id: "RIDE-2025-001",
        riderId: "R001",
        riderName: "John Doe",
        driverId: "D001",
        driverName: "Mike Smith",
        status: "ongoing",
        pickup: "Downtown Plaza, Main St",
        drop: "Airport Terminal 1",
        time: "2:30 PM",
        date: "Today",
        price: "$24.50",
        distance: "12.3 km",
        duration: "28 min",
        logs: [
          { id: "log1", timestamp: "2:15 PM", message: "Driver assigned", type: "info" },
          { id: "log2", timestamp: "2:18 PM", message: "Driver en route to pickup", type: "info" },
          { id: "log3", timestamp: "2:25 PM", message: "Driver arrived at pickup", type: "success" },
          { id: "log4", timestamp: "2:30 PM", message: "Ride started", type: "info" },
        ],
        currentLocation: {
          lat: 37.7749,
          lng: -122.4194,
          address: "Market St & 5th St",
          updatedAt: "2:45 PM",
        },
        chatMessages: [
          { id: "1", sender: "admin", message: "How's the ride going?", timestamp: "2:40 PM", read: true },
          { id: "2", sender: "driver", message: "All good, ETA 15 mins", timestamp: "2:41 PM", read: true },
        ],
      },
      {
        id: "RIDE-2025-002",
        riderId: "R002",
        riderName: "Sarah Wilson",
        driverId: "D002",
        driverName: "David Brown",
        status: "completed",
        pickup: "Central Mall, 5th Ave",
        drop: "Residential Area, Oak St",
        time: "1:15 PM",
        date: "Today",
        price: "$18.75",
        distance: "8.7 km",
        duration: "22 min",
        logs: [
          { id: "log1", timestamp: "1:00 PM", message: "Driver assigned", type: "info" },
          { id: "log2", timestamp: "1:05 PM", message: "Driver en route to pickup", type: "info" },
          { id: "log3", timestamp: "1:10 PM", message: "Driver arrived at pickup", type: "success" },
          { id: "log4", timestamp: "1:15 PM", message: "Ride started", type: "info" },
          { id: "log5", timestamp: "1:37 PM", message: "Ride completed", type: "success" },
        ],
        chatMessages: [],
      },
      {
        id: "RIDE-2025-003",
        riderId: "R003",
        riderName: "Alex Johnson",
        driverId: "D003",
        driverName: "Lisa Garcia",
        status: "cancelled",
        pickup: "Business District, Park Ave",
        drop: "University Campus",
        time: "12:45 PM",
        date: "Today",
        price: "$0.00",
        distance: "5.2 km",
        duration: "0 min",
        logs: [
          { id: "log1", timestamp: "12:30 PM", message: "Driver assigned", type: "info" },
          { id: "log2", timestamp: "12:35 PM", message: "Driver en route to pickup", type: "info" },
          { id: "log3", timestamp: "12:42 PM", message: "Rider cancelled", type: "error" },
        ],
        chatMessages: [
          { id: "1", sender: "admin", message: "Why was this cancelled?", timestamp: "12:45 PM", read: true },
          { id: "2", sender: "rider", message: "Emergency came up", timestamp: "12:46 PM", read: true },
        ],
      },
      {
        id: "RIDE-2025-004",
        riderId: "R004",
        riderName: "Emma Davis",
        driverId: "D004",
        driverName: "Tom Wilson",
        status: "ongoing",
        pickup: "Shopping Center, Broadway",
        drop: "Medical Center, Health St",
        time: "3:00 PM",
        date: "Today",
        price: "$32.20",
        distance: "15.8 km",
        duration: "35 min",
        logs: [
          { id: "log1", timestamp: "2:45 PM", message: "Driver assigned", type: "info" },
          { id: "log2", timestamp: "2:50 PM", message: "Driver en route to pickup", type: "info" },
          { id: "log3", timestamp: "2:58 PM", message: "Driver arrived at pickup", type: "success" },
          { id: "log4", timestamp: "3:00 PM", message: "Ride started", type: "info" },
        ],
        currentLocation: {
          lat: 37.7833,
          lng: -122.4167,
          address: "Broadway & Columbus Ave",
          updatedAt: "3:15 PM",
        },
        chatMessages: [
          { id: "1", sender: "admin", message: "Traffic update needed", timestamp: "3:10 PM", read: false },
          { id: "2", sender: "driver", message: "Heavy traffic on Broadway", timestamp: "3:12 PM", read: true },
        ],
      },
      {
        id: "RIDE-2025-005",
        riderId: "R005",
        riderName: "Robert Chen",
        driverId: "D005",
        driverName: "Maria Lopez",
        status: "completed",
        pickup: "Tech Park, Innovation Dr",
        drop: "Central Station",
        time: "11:30 AM",
        date: "Today",
        price: "$15.40",
        distance: "7.2 km",
        duration: "18 min",
        logs: [
          { id: "log1", timestamp: "11:15 AM", message: "Driver assigned", type: "info" },
          { id: "log2", timestamp: "11:20 AM", message: "Driver en route to pickup", type: "info" },
          { id: "log3", timestamp: "11:25 AM", message: "Driver arrived at pickup", type: "success" },
          { id: "log4", timestamp: "11:30 AM", message: "Ride started", type: "info" },
          { id: "log5", timestamp: "11:48 AM", message: "Ride completed", type: "success" },
        ],
        chatMessages: [],
      },
      {
        id: "RIDE-2025-006",
        riderId: "R006",
        riderName: "Jessica Taylor",
        driverId: "D006",
        driverName: "Kevin Patel",
        status: "cancelled",
        pickup: "Sunset Apartments",
        drop: "City Library",
        time: "10:15 AM",
        date: "Today",
        price: "$0.00",
        distance: "3.5 km",
        duration: "0 min",
        logs: [
          { id: "log1", timestamp: "10:00 AM", message: "Driver assigned", type: "info" },
          { id: "log2", timestamp: "10:05 AM", message: "Driver en route to pickup", type: "info" },
          { id: "log3", timestamp: "10:12 PM", message: "Driver cancelled", type: "error" },
        ],
        chatMessages: [],
      },
    ]

    if (status && status !== "all") {
      return allRides.filter((ride) => ride.status === status)
    }

    return allRides
  },

  getRideLogs: async (rideId) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const ride = (await api.getRides()).find((r) => r.id === rideId)
    return ride?.logs || []
  },

  updateRideStatus: async (rideId, status) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 600))

    // In a real app, this would update the backend
    console.log(`Updating ride ${rideId} status to ${status}`)
    return true
  },
}

// Mock WebSocket for real-time updates
const createMockWebSocket = (onMessage) => {
  const intervalId = setInterval(() => {
    // Simulate random updates
    if (Math.random() > 0.7) {
      const updateTypes = [
        {
          type: "location_update",
          rideId: "RIDE-2025-001",
          lat: 37.7749 + Math.random() * 0.01,
          lng: -122.4194 + Math.random() * 0.01,
          address: "Updated location near Market St",
        },
        {
          type: "location_update",
          rideId: "RIDE-2025-004",
          lat: 37.7833 + Math.random() * 0.01,
          lng: -122.4167 + Math.random() * 0.01,
          address: "Updated location near Broadway",
        },
        { type: "status_update", rideId: "RIDE-2025-002", status: "completed" },
        { type: "new_ride", rideId: "RIDE-2025-007", riderName: "New Customer" },
        { type: "ride_cancelled", rideId: "RIDE-2025-003" },
      ]

      const update = updateTypes[Math.floor(Math.random() * updateTypes.length)]
      onMessage(update)
    }
  }, 8000) // Check for updates every 8 seconds

  return {
    close: () => clearInterval(intervalId),
  }
}

const cannedMessages = [
  "Please reach pickup location soon",
  "What's the delay reason?",
  "Rider is waiting at pickup",
  "Please contact rider",
  "Route update available",
  "Thank you for the update",
]

// Simple Toast Hook
const useToast = () => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback(({ title, description, variant = "default" }) => {
    const id = Date.now()
    const newToast = { id, title, description, variant }
    setToasts((prev) => [...prev, newToast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const ToastContainer = () => (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[300px] rounded-lg border p-3 shadow-lg transition-all duration-300 ${
            toast.variant === "destructive"
              ? "border-red-500 bg-red-900/90 text-red-100"
              : "border-gray-600 bg-gray-800/90 text-gray-100"
          }`}
          style={{
            animation: "slideInFromRight 0.3s ease-out",
          }}
        >
          <div className="font-semibold">{toast.title}</div>
          <div className="text-sm opacity-90">{toast.description}</div>
        </div>
      ))}
      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )

  return { showToast, ToastContainer }
}

// Filter Bar Component
const FilterBar = ({ searchTerm, onSearchChange, statusFilter, onStatusChange, onRefresh, refreshing }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Ride ID, Rider, Driver or Location"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full md:w-80 rounded-lg border border-gray-600 bg-gray-800 pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <button
        onClick={onRefresh}
        disabled={refreshing}
        className={`rounded-lg border border-gray-600 p-2 text-gray-400 transition-all hover:bg-gray-700 hover:text-white disabled:opacity-50 ${
          refreshing ? "animate-spin" : ""
        }`}
      >
        🔄
      </button>
    </div>
  )
}

// Ride Card Component
const RideCard = ({ ride, onTrack, onChat, getStatusBadge }) => {
  return (
    <div className="cursor-pointer rounded-xl border border-gray-700 bg-gray-800 p-6 transition-all hover:border-gray-500 hover:shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">#{ride.id}</h3>
        {getStatusBadge(ride.status)}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-base">👤</span>
            <span>{ride.riderName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="text-base">🚗</span>
            <span>{ride.driverName}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-base text-emerald-400 mt-0.5">📍</span>
            <span>{ride.pickup}</span>
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-base text-red-400 mt-0.5">🎯</span>
            <span>{ride.drop}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-700 pt-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-base">🕒</span>
            <span>
              {ride.date} • {ride.time}
            </span>
          </div>
          <div className="flex gap-2">
            {ride.status === "ongoing" && (
              <button
                className="flex-1 md:flex-none rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                onClick={() => onTrack(ride)}
              >
                Track
              </button>
            )}
            <button
              className="flex-1 md:flex-none rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700"
              onClick={() => onChat(ride)}
            >
              💬 Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading State Component
const LoadingState = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-gray-700 bg-gray-800 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-6 w-32 animate-pulse rounded bg-gray-700"></div>
            <div className="h-6 w-24 animate-pulse rounded bg-gray-700"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-gray-700"></div>
            <div className="h-4 w-4/5 animate-pulse rounded bg-gray-700"></div>
            <div className="h-4 w-3/5 animate-pulse rounded bg-gray-700"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// No Results Component
const NoResults = ({ searchTerm, onReset }) => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-700 bg-gray-800 py-16 px-8 text-center">
      <div className="mb-4 text-6xl opacity-50">🔍</div>
      <h3 className="mb-2 text-xl font-bold text-white">No rides found</h3>
      <p className="mb-6 text-gray-400">
        {searchTerm
          ? "Try adjusting your search or filter criteria"
          : "There are no rides matching the selected status"}
      </p>
      <button
        onClick={onReset}
        className="rounded-lg border border-gray-600 px-6 py-2 text-gray-300 transition-colors hover:bg-gray-700"
      >
        Reset Filters
      </button>
    </div>
  )
}

// Tracking Modal Component
const TrackingModal = ({ isOpen, onClose, ride, activeTab, onTabChange, getStatusBadge, onStatusChange }) => {
  if (!isOpen || !ride) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="w-full max-h-[90vh] max-w-2xl overflow-y-auto rounded-xl border border-gray-700 bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white">#{ride.id}</h2>
          <button className="text-xl text-gray-400 hover:text-white transition-colors" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {getStatusBadge(ride.status)}

            {ride.status === "ongoing" && (
              <div className="flex gap-3">
                <button
                  className="flex-1 md:flex-none rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                  onClick={() => onStatusChange(ride.id, "completed")}
                >
                  Complete
                </button>
                <button
                  className="flex-1 md:flex-none rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  onClick={() => onStatusChange(ride.id, "cancelled")}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="mb-6 flex rounded-lg bg-gray-700 p-1">
              <button
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "details" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => onTabChange("details")}
              >
                Details
              </button>
              <button
                className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === "logs" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"
                }`}
                onClick={() => onTabChange("logs")}
              >
                Trip Logs
              </button>
              {ride.status === "ongoing" && (
                <button
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === "tracking" ? "bg-gray-600 text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => onTabChange("tracking")}
                >
                  Live Tracking
                </button>
              )}
            </div>

            <div className="min-h-[300px]">
              {activeTab === "details" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-gray-400">Rider</label>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                          {ride.riderName.charAt(0)}
                        </div>
                        <span className="text-white">{ride.riderName}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-gray-400">Driver</label>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                          {ride.driverName.charAt(0)}
                        </div>
                        <span className="text-white">{ride.driverName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-gray-400">Pickup Location</label>
                    <div className="flex items-start gap-3">
                      <span className="text-lg text-emerald-400 mt-0.5">📍</span>
                      <span className="text-white">{ride.pickup}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-gray-400">Drop Location</label>
                    <div className="flex items-start gap-3">
                      <span className="text-lg text-red-400 mt-0.5">🎯</span>
                      <span className="text-white">{ride.drop}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-gray-400">Price</label>
                      <span className="text-lg font-semibold text-emerald-400">{ride.price}</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-gray-400">Distance</label>
                      <span className="text-white">{ride.distance}</span>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase text-gray-400">Duration</label>
                      <span className="text-white">{ride.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase text-gray-400">Time</label>
                    <div className="flex items-center gap-3 text-gray-300">
                      <span className="text-lg">📅</span>
                      <span>
                        {ride.date} • {ride.time}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white">Trip Activity Log</h3>
                  <div className="space-y-4">
                    {ride.logs?.map((log) => (
                      <div
                        key={log.id}
                        className={`flex gap-4 rounded-lg border-l-4 p-4 ${
                          log.type === "success"
                            ? "border-l-emerald-500 bg-emerald-900/20"
                            : log.type === "error"
                              ? "border-l-red-500 bg-red-900/20"
                              : log.type === "warning"
                                ? "border-l-amber-500 bg-amber-900/20"
                                : "border-l-blue-500 bg-blue-900/20"
                        }`}
                      >
                        <div className="text-lg mt-0.5">
                          {log.type === "success"
                            ? "✅"
                            : log.type === "error"
                              ? "❌"
                              : log.type === "warning"
                                ? "⚠"
                                : "ℹ"}
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{log.message}</p>
                          <span className="text-xs text-gray-400">{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "tracking" && ride.status === "ongoing" && (
                <div className="space-y-6">
                  <div className="relative flex h-64 flex-col items-center justify-center rounded-lg bg-gray-700 p-6 text-center">
                    <div className="mb-4 text-6xl text-emerald-400" style={{ animation: "bounce 2s infinite" }}>
                      🗺
                    </div>
                    <p className="text-white font-medium">Live Location</p>
                    {ride.currentLocation ? (
                      <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-gray-800/95 p-4 text-left">
                        <p className="text-sm text-gray-300">{ride.currentLocation.address}</p>
                        <span className="text-xs text-gray-400">Updated at {ride.currentLocation.updatedAt}</span>
                      </div>
                    ) : (
                      <p className="text-gray-400">Waiting for location update...</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg bg-gray-700 p-4 text-center">
                      <label className="block text-xs text-gray-400 mb-2">Estimated Time</label>
                      <span className="text-lg font-semibold text-white">{ride.duration} remaining</span>
                    </div>
                    <div className="rounded-lg bg-gray-700 p-4 text-center">
                      <label className="block text-xs text-gray-400 mb-2">Distance</label>
                      <span className="text-lg font-semibold text-white">{ride.distance}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 md:flex-row">
                    <button className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700">
                      Refresh Location
                    </button>
                    <button
                      className="flex-1 rounded-lg bg-emerald-600 px-4 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
                      onClick={() => onStatusChange(ride.id, "completed")}
                    >
                      Complete Ride
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Chat Modal Component
const ChatModal = ({
  isOpen,
  onClose,
  ride,
  getStatusBadge,
  chatMessage,
  onChatMessageChange,
  onSendMessage,
  cannedMessages,
}) => {
  if (!isOpen || !ride) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="flex h-[80vh] w-full max-w-md flex-col rounded-xl border border-gray-700 bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-700 p-4">
          <h2 className="text-lg font-semibold text-white">Chat - #{ride.id}</h2>
          <button className="text-xl text-gray-400 hover:text-white transition-colors" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <div className="mb-4 flex items-center justify-between rounded-lg bg-gray-700 p-3">
            <div>
              <p className="font-semibold text-white">#{ride.id}</p>
              <p className="text-sm text-gray-300">
                {ride.riderName} ↔ {ride.driverName}
              </p>
            </div>
            {getStatusBadge(ride.status)}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto mb-4">
            {ride.chatMessages?.length > 0 ? (
              ride.chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-lg p-3 ${
                      msg.sender === "admin" ? "bg-emerald-600 text-white" : "bg-gray-700 text-white"
                    }`}
                  >
                    <div className="mb-1 text-xs uppercase opacity-75">{msg.sender}</div>
                    <p className="text-sm">{msg.message}</p>
                    <span className="mt-1 block text-xs opacity-75">{msg.timestamp}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center text-gray-400">
                <div className="mb-4 text-5xl opacity-50">💬</div>
                <p className="text-white mb-1">No messages yet</p>
                <p className="text-sm">Start a conversation with the driver or rider</p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <p className="mb-2 text-xs text-gray-400">Quick Messages:</p>
            <div className="flex flex-wrap gap-2">
              {cannedMessages.slice(0, 3).map((msg, index) => (
                <button
                  key={index}
                  className="rounded-md border border-gray-600 px-3 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-700"
                  onClick={() => onChatMessageChange(msg)}
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => onChatMessageChange(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === "Enter" && onSendMessage()}
              className="flex-1 rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={onSendMessage}
              disabled={!chatMessage.trim()}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📤
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RidesManagement() {
  const [rides, setRides] = useState([])
  const [filteredRides, setFilteredRides] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRide, setSelectedRide] = useState(null)
  const [isTrackingOpen, setIsTrackingOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [chatMessage, setChatMessage] = useState("")
  const webSocketRef = useRef(null)
  const { showToast, ToastContainer } = useToast()

  // Fetch rides on initial load and when status filter changes
  useEffect(() => {
    const fetchRides = async () => {
      setLoading(true)
      try {
        const data = await api.getRides(statusFilter !== "all" ? statusFilter : undefined)
        setRides(data)
        setFilteredRides(data)
      } catch (error) {
        console.error("Error fetching rides:", error)
        showToast({
          title: "Error fetching rides",
          description: "Could not load ride data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRides()
  }, [statusFilter, showToast])

  // Setup WebSocket for real-time updates
  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      if (data.type === "location_update") {
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride.id === data.rideId
              ? {
                  ...ride,
                  currentLocation: {
                    lat: data.lat,
                    lng: data.lng,
                    address: data.address,
                    updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                }
              : ride,
          ),
        )

        // Update selected ride if it's the one being tracked
        if (selectedRide?.id === data.rideId) {
          setSelectedRide((prev) =>
            prev
              ? {
                  ...prev,
                  currentLocation: {
                    lat: data.lat,
                    lng: data.lng,
                    address: data.address,
                    updatedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  },
                }
              : null,
          )
        }

        showToast({
          title: "Location Updated",
          description: `Ride ${data.rideId} location has been updated.`
        })
      } else if (data.type === "status_update") {
        setRides((prevRides) =>
          prevRides.map((ride) => (ride.id === data.rideId ? { ...ride, status: data.status } : ride)),
        )

        showToast({
          title: "Status Updated",
          description: `Ride ${data.rideId} status changed to ${data.status}.`,
          variant: "default",
        })
      } else if (data.type === "new_ride") {
        showToast({
          title: "New Ride",
          description: `New ride request from ${data.riderName}.`,
          variant: "default",
        })
      } else if (data.type === "ride_cancelled") {
        showToast({
          title: "Ride Cancelled",
          description: `Ride ${data.rideId} has been cancelled.`,
          variant: "destructive",
        })
      }
    }

    webSocketRef.current = createMockWebSocket(handleWebSocketMessage)

    return () => {
      if (webSocketRef.current) {
        webSocketRef.current.close()
      }
    }
  }, [selectedRide, showToast])

  // Filter rides based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRides(rides)
      return
    }

    const filtered = rides.filter(
      (ride) =>
        ride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.riderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.pickup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ride.drop.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    setFilteredRides(filtered)
  }, [rides, searchTerm])

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        className:
          "inline-flex items-center gap-1 rounded-full bg-emerald-900/50 px-3 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/30",
        text: "✓ Completed",
      },
      ongoing: {
        className:
          "inline-flex items-center gap-1 rounded-full bg-blue-900/50 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/30",
        text: "● Ongoing",
        pulse: true,
      },
      cancelled: {
        className:
          "inline-flex items-center gap-1 rounded-full bg-red-900/50 px-3 py-1 text-xs font-medium text-red-400 border border-red-500/30",
        text: "✕ Cancelled",
      },
    }

    const config = statusConfig[status] || {
      className: "inline-flex items-center gap-1 rounded-full bg-gray-700 px-3 py-1 text-xs font-medium text-gray-300",
      text: status,
    }

    return <span className={`${config.className} ${config.pulse ? "animate-pulse" : ""}`}>{config.text}</span>
  }

  const handleTrackRide = async (ride) => {
    setSelectedRide(ride)
    setIsTrackingOpen(true)
    setActiveTab("details")

    // Fetch the latest logs when tracking a ride
    try {
      const logs = await api.getRideLogs(ride.id)
      setSelectedRide((prev) => (prev ? { ...prev, logs } : null))
    } catch (error) {
      console.error("Error fetching ride logs:", error)
    }
  }

  const handleChatRide = (ride) => {
    setSelectedRide(ride)
    setIsChatOpen(true)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const data = await api.getRides(statusFilter !== "all" ? statusFilter : undefined)
      setRides(data)
      setFilteredRides(
        searchTerm
          ? data.filter(
              (ride) =>
                ride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ride.riderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                ride.driverName.toLowerCase().includes(searchTerm.toLowerCase()),
            )
          : data,
      )

      showToast({
        title: "Data Refreshed",
        description: "Ride data has been updated.",
      })
    } catch (error) {
      console.error("Error refreshing rides:", error)
      showToast({
        title: "Refresh Failed",
        description: "Could not refresh ride data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setRefreshing(false)
    }
  }

  const handleStatusChange = async (rideId, newStatus) => {
    try {
      await api.updateRideStatus(rideId, newStatus)

      // Update local state
      setRides((prevRides) => prevRides.map((ride) => (ride.id === rideId ? { ...ride, status: newStatus } : ride)))

      // Update selected ride if it's the one being modified
      if (selectedRide?.id === rideId) {
        setSelectedRide((prev) => (prev ? { ...prev, status: newStatus } : null))
      }

      showToast({
        title: "Status Updated",
        description: `Ride status changed to ${newStatus}.`,
      })
    } catch (error) {
      console.error("Error updating ride status:", error)
      showToast({
        title: "Update Failed",
        description: "Could not update ride status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const sendChatMessage = () => {
    if (!chatMessage.trim() || !selectedRide) return

    const newMessage = {
      id:` msg-${Date.now()}`,
      sender: "admin",
      message: chatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
    }

    // Update both rides state and selectedRide state
    setRides((prevRides) =>
      prevRides.map((ride) =>
        ride.id === selectedRide.id ? { ...ride, chatMessages: [...(ride.chatMessages || []), newMessage] } : ride,
      ),
    )

    setSelectedRide((prev) => (prev ? { ...prev, chatMessages: [...(prev.chatMessages || []), newMessage] } : null))

    setChatMessage("")

    // Simulate driver/rider response after 2-5 seconds
    setTimeout(
      () => {
        const responses = [
          "Got it, thanks!",
          "Will update soon",
          "On my way",
          "Traffic is heavy",
          "Almost there",
          "Understood",
        ]

        const response = {
          id: `msg-${Date.now()}-response`,
          sender: Math.random() > 0.5 ? "driver" : "rider",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          read: false,
          message: responses[Math.floor(Math.random() * responses.length)],
        }

        // Update both rides state and selectedRide state
        setRides((prevRides) =>
          prevRides.map((ride) =>
            ride.id === selectedRide.id ? { ...ride, chatMessages: [...(ride.chatMessages || []), response] } : ride,
          ),
        )

        setSelectedRide((prev) => (prev ? { ...prev, chatMessages: [...(prev.chatMessages || []), response] } : null))
      },
      Math.random() * 3000 + 2000,
    )
  }

  const handleResetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer />

      {/* Page Content */}
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-6 text-3xl font-bold text-white">Rides Management</h1>

          {/* Filters and Search */}
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        </div>

        {/* Loading State */}
        {loading && <LoadingState />}

        {/* No Results */}
        {!loading && filteredRides.length === 0 && <NoResults searchTerm={searchTerm} onReset={handleResetFilters} />}

        {/* Rides Grid */}
        {!loading && filteredRides.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredRides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onTrack={handleTrackRide}
                onChat={handleChatRide}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}

        {/* Tracking Modal */}
        <TrackingModal
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
          ride={selectedRide}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          getStatusBadge={getStatusBadge}
          onStatusChange={handleStatusChange}
        />

        {/* Chat Modal */}
        <ChatModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          ride={selectedRide}
          getStatusBadge={getStatusBadge}
          chatMessage={chatMessage}
          onChatMessageChange={setChatMessage}
          onSendMessage={sendChatMessage}
          cannedMessages={cannedMessages}
        />
      </div>
    </div>
  )
}