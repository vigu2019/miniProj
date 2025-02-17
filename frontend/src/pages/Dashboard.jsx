import { useState } from "react";
import { Sidebar } from "../components/Dashboard/Sidebar";
import { PrintDashboard } from "../components/Dashboard/PrintDashboard";
import StoreDashboard  from "../components/Dashboard/StoreDashboard";
import { Navbar } from "../components/Navbar/Navbar";

export default function Dashboard() {
    const [activeSection, setActiveSection] = useState("print");

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                <main className="flex-1 overflow-y-auto p-4">
                    {activeSection === "print" ? <PrintDashboard /> : <StoreDashboard />}
                </main>
            </div>
        </div>
    );
}