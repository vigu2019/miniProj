import Dashboard from "@/components/Storekeeper/KeeperDashboard"
import { Navbar } from "@/components/Navbar/Navbar"

export default function StorekeeperDashboard() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-gray-100">
        <main className="flex-1 overflow-y-auto p-4">
          <Dashboard />
        </main>
      </div>
    </>
  )
}

