import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "react-toastify";
import { urls } from "@/utils/urls";
import { useAuthContext } from "@/context/AuthContext";
import axios from "axios";

export function AddNewPrint() {
  const [file, setFile] = useState(null);
  const [copies, setCopies] = useState(1);
  const [printType, setPrintType] = useState("black-and-white");
  const [printSide, setPrintSide] = useState("single");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {authUser} = useAuthContext();
  // console.log(authUser)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please upload a file");
      return;
    }
    
    // Create FormData object to send file and other data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", authUser.id);
    formData.append("copies", copies);
    formData.append("printType", printType);
    formData.append("printSide", printSide);
    formData.append("description", description);
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(urls.addPrint, formData)
      toast.success(response.data.message);
      
      // Reset form
      setFile(null);
      setCopies(1);
      setPrintType("black-and-white");
      setPrintSide("single");
      setDescription("");
      
      // Reset file input by getting the element and resetting its value
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
      
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-2xl font-semibold mb-6">Add New Print</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="file-upload">Upload File</Label>
          <Input 
            id="file-upload" 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)} 
            required 
          />
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
          <RadioGroup 
            defaultValue="black-and-white" 
            value={printType}
            onValueChange={setPrintType}
          >
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
          <Select value={printSide} onValueChange={setPrintSide}>
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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : "Add Print"}
        </Button>
      </form>
    </div>
  );
}