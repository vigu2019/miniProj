import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddNewPrint() {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Submitted:", { name, file });
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Add New Print</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="print-name">Print Name</Label>
          <Input
            id="print-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter print name"
            required
          />
        </div>
        <div>
          <Label htmlFor="file-upload">Upload File</Label>
          <Input
            id="file-upload"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>
        <Button type="submit">Add Print</Button>
      </form>
    </div>
  );
}

export default AddNewPrint;
