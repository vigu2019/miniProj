import { Button } from "@/components/ui/button";
import { Printer, Archive } from "lucide-react";

export function Sidebar({ activeSection, setActiveSection }) {
    return (
        <div className="w-64 bg-white shadow-md h-full">
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <nav>
            <Button
                variant={activeSection === "print" ? "default" : "ghost"}
                className="w-full justify-start mb-2"
                onClick={() => setActiveSection("print")}
            >
                <Printer className="mr-2 h-4 w-4" />
                Print
            </Button>
            <Button
                variant={activeSection === "store" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("store")}
            >
                <Archive className="mr-2 h-4 w-4" />
                Store
            </Button>
            </nav>
        </div>
        </div>
    );
}
