

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddNewPrint() {
  // const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState("black-and-white");
  const [printSide, setPrintSide] = useState("single");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", { file, copies, printType, printSide, description });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">Add New Print</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <div>
          <Label htmlFor="print-name">Name-Class</Label>
          <Input
            id="print-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name-class(Eg:Shivani-s6 CSEC"
            required
          />
        </div> */}

        <div>
          <Label htmlFor="file-upload">Upload File</Label>
          <Input id="file-upload" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
        </div>

        <div>
          <Label htmlFor="copies">Number of Copies</Label>
          <Input
            id="copies"
            type="number"
            min="1"
            value={copies}
            onChange={(e) => setCopies(Number.parseInt(e.target.value) || 1)}
            required
          />
        </div>

        <div>
          <Label>Print Type</Label>
          <RadioGroup defaultValue="black-and-white" onChange={(e) => setPrintType(e.target.value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="black-and-white" id="black-and-white" />
              <Label htmlFor="black-and-white">Black and White</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="color" id="color" />
              <Label htmlFor="color">Color</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="print-side">Print Side</Label>
          <Select onChange={(e) => setPrintSide(e.target.value)} defaultValue="single">
            <SelectTrigger id="print-side">
              <SelectValue placeholder="Select print side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single-sided</SelectItem>
              <SelectItem value="double">Double-sided</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter any additional details or instructions"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full">
          Add Print
        </Button>
      </form>
    </div>
  );
}
