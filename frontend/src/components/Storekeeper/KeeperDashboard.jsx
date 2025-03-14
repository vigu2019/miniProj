"use client"
import { useState } from "react"
import { Package2, Search, CheckCircle, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrdersTable from "@/components/Storekeeper/StoreOrders"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value)
    // Don't reset search when changing status tabs
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Main content */}
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Package2 className="h-6 w-6" />
                <h1 className="text-xl font-semibold">StoreKeeper Orders</h1>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <form className="ml-auto flex-1 sm:flex-initial">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search orders..."
                    className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
          </header>
          <div className="flex-1 space-y-4 p-4 md:p-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="space-y-4">
              <TabsList>
                <TabsTrigger value="all" className="flex items-center gap-2">
                  <Package2 className="h-4 w-4" />
                  <span>All Orders</span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Pending</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completed</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                <OrdersTable searchQuery={searchQuery} statusFilter="all" />
              </TabsContent>
              <TabsContent value="pending" className="space-y-4">
                <OrdersTable searchQuery={searchQuery} statusFilter="pending" />
              </TabsContent>
              <TabsContent value="completed" className="space-y-4">
                <OrdersTable searchQuery={searchQuery} statusFilter="completed" />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}