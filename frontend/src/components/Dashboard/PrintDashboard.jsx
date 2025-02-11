import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CompletedPrints } from "./PrintDashboard/CompletedPrints"
import { PendingPrints } from "./PrintDashboard/PendingPrints"
import { AddNewPrint } from "./PrintDashboard/AddNewPrint"

export function PrintDashboard() {
    const [activeTab, setActiveTab] = useState("completed")

    return (
        <div>
        <h2 className="text-2xl font-bold mb-4">Print Dashboard</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="add-new">Add New Print</TabsTrigger>
            </TabsList>
            <TabsContent value="completed">
            <CompletedPrints />
            </TabsContent>
            <TabsContent value="pending">
            <PendingPrints />
            </TabsContent>
            <TabsContent value="add-new">
            <AddNewPrint />
            </TabsContent>
        </Tabs>
        </div>
    )
}

