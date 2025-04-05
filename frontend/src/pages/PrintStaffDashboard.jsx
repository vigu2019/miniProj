import { PrintShopkeeperDashboard } from "@/components/PrintStaff/PrintShopkeeperDashboard"
import { Navbar } from "@/components/Navbar/Navbar"

export default function PrintStaffDashboard() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-gray-100">
        <main className="flex-1 overflow-y-auto p-4">
          <PrintShopkeeperDashboard />
        </main>
      </div>
    </>
  )
}