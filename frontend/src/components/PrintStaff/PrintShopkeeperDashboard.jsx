"use client"

import { useState, useEffect } from "react"
import {
  Clock,
  FileText,
  Filter,
  Printer,
  RefreshCw,
  Search,
  Settings,
  User,
  X,
  CheckCircle2,
  AlertCircle,
  Hourglass,
  ExternalLink
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { urls } from "@/utils/urls"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axios from "axios"
// import urls  from "@/utils/urls"
import { toast } from "react-toastify"
// import { toast } from "@/components/ui/use-toast"

// Status options for dropdown - removed "printing" status
const statusOptions = [
  { value: "pending", label: "Pending", icon: Hourglass },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
  { value: "failed", label: "Failed", icon: AlertCircle },
]

export function PrintShopkeeperDashboard() {
  const [printJobs, setPrintJobs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Fetch print jobs from API
  const fetchPrintJobs = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(urls.getAllPrints,{
        headers:{
          "Authorization": `Bearer ${token}`,
        }
      })
      if (response.data.success) {
        // Transform the data to match our component's expected format
        const formattedJobs = response.data.items.map(job => ({
          id: job.id,
          customerName: job.user_name,
          documentName: getFileNameFromUrl(job.file_url),
          fileUrl: job.file_url,
          copies: job.copies,
          printType: job.print_type,
          printSide: job.print_side,
          description: job.description,
          status: job.status,
          submittedAt: job.created_at
        }))
        setPrintJobs(formattedJobs)
      } else {
        toast.error("Failed to fetch print jobs")
      }
    } catch (error) {
      console.error("Error fetching print jobs:", error)
      toast.error("Error fetching print jobs: " + (error.response?.data?.error || error.message))
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to extract filename from file_url
  const getFileNameFromUrl = (url) => {
    if (!url) return "Unknown File"
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  // Open document in new tab
  const openDocumentInNewTab = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank')
    } else {
      toast.error("Document URL not available")
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchPrintJobs()
  }, [])

  // Filter print jobs based on search query and status filter
  const filteredPrintJobs = printJobs.filter((job) => {
    const matchesSearch =
      (job.customerName && job.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.documentName && job.documentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (job.id && job.id.toString().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Update job status
  const updateJobStatus = async (jobId, newStatus) => {
    try {
      console.log("Updating job status:", jobId, newStatus)
      const response = await axios.put(urls.updatePrintStatus, {
        printId: jobId,
        status: newStatus,
      }, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
      })
      if (response.data.success) {
        setPrintJobs((prevJobs) => 
          prevJobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job))
        )
        toast.success("sucessfully updated the status")
      } else {
        toast.error("Failed to update")
      }
    } catch (error) {
      console.error("Error updating job status:", error)
      toast.error("Something went wrong")
    }
  }

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }


  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid flex-1 items-start gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div className="col-span-full grid gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">Print Jobs</h2>
              <Badge className="ml-2">{filteredPrintJobs.length}</Badge>
            </div>
            <div className="ml-auto flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  className="h-8 w-[150px] sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" className="h-8" onClick={fetchPrintJobs}>
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <TabsContent value="all" className="mt-4">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPrintJobs.length > 0 ? (
                      filteredPrintJobs.map((job) => (
                        <Card key={job.id} className="overflow-hidden">
                          <CardHeader className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <CardTitle className="text-base">
                                  {job.documentName || "Unnamed File"}
                                  <Badge variant="outline" className="ml-2 bg-gray-50">ID: {job.id}</Badge>
                                </CardTitle>
                                <CardDescription>{job.customerName || "Unknown User"}</CardDescription>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => openDocumentInNewTab(job.fileUrl)}>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View Document
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                  {statusOptions.map((option) => (
                                    <DropdownMenuItem
                                      key={option.value}
                                      onClick={() => updateJobStatus(job.id, option.value)}
                                      disabled={job.status === option.value}
                                    >
                                      <option.icon className="mr-2 h-4 w-4" />
                                      {option.label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Print Type</span>
                                <span>{job.printType || "N/A"}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Copies</span>
                                <span>{job.copies || "N/A"}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Print Side</span>
                                <span>{job.printSide || "N/A"}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-muted-foreground">Status</span>
                                <span>{getStatusBadge(job.status)}</span>
                              </div>
                              <div className="flex flex-col col-span-2">
                                <span className="text-muted-foreground">Uploaded At</span>
                                <span>{formatDate(job.submittedAt)}</span>
                              </div>
                              <div className="flex flex-col col-span-2">
                                <span className="text-muted-foreground">Description</span>
                                <span className="truncate">{job.description || "No description"}</span>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between p-4 pt-0">
                            <Button variant="outline" size="sm" onClick={() => openDocumentInNewTab(job.fileUrl)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Document
                            </Button>
                            <Select value={job.status} onValueChange={(value) => updateJobStatus(job.id, value)}>
                              <SelectTrigger className="h-8 w-[130px]">
                                <SelectValue placeholder="Update Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center">
                                      <option.icon className="mr-2 h-4 w-4" />
                                      {option.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </CardFooter>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-3 text-center p-8">
                        <p className="text-muted-foreground">No print jobs found</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                {/* Tab contents for other status filters - similar structure as above */}
                {["pending", "completed"].map((status) => (
                  <TabsContent key={status} value={status} className="mt-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredPrintJobs.filter((job) => job.status === status).length > 0 ? (
                        filteredPrintJobs
                          .filter((job) => job.status === status)
                          .map((job) => (
                            <Card key={job.id} className="overflow-hidden">
                              <CardHeader className="p-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <CardTitle className="text-base">
                                      {job.documentName || "Unnamed File"}
                                      <Badge variant="outline" className="ml-2 bg-gray-50">ID: {job.id}</Badge>
                                    </CardTitle>
                                    <CardDescription>{job.customerName || "Unknown User"}</CardDescription>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <Settings className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                      <DropdownMenuItem onClick={() => openDocumentInNewTab(job.fileUrl)}>
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        View Document
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                      {statusOptions.map((option) => (
                                        <DropdownMenuItem
                                          key={option.value}
                                          onClick={() => updateJobStatus(job.id, option.value)}
                                          disabled={job.status === option.value}
                                        >
                                          <option.icon className="mr-2 h-4 w-4" />
                                          {option.label}
                                        </DropdownMenuItem>
                                      ))}
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground">Print Type</span>
                                    <span>{job.printType || "N/A"}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground">Copies</span>
                                    <span>{job.copies || "N/A"}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground">Print Side</span>
                                    <span>{job.printSide || "N/A"}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-muted-foreground">Status</span>
                                    <span>{getStatusBadge(job.status)}</span>
                                  </div>
                                  <div className="flex flex-col col-span-2">
                                    <span className="text-muted-foreground">Uploaded At</span>
                                    <span>{formatDate(job.submittedAt)}</span>
                                  </div>
                                  <div className="flex flex-col col-span-2">
                                    <span className="text-muted-foreground">Description</span>
                                    <span className="truncate">{job.description || "No description"}</span>
                                  </div>
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between p-4 pt-0">
                                <Button variant="outline" size="sm" onClick={() => openDocumentInNewTab(job.fileUrl)}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View Document
                                </Button>
                                <Select value={job.status} onValueChange={(value) => updateJobStatus(job.id, value)}>
                                  <SelectTrigger className="h-8 w-[130px]">
                                    <SelectValue placeholder="Update Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {statusOptions.map((option) => (
                                      <SelectItem key={option.value} value={option.value}>
                                        <div className="flex items-center">
                                          <option.icon className="mr-2 h-4 w-4" />
                                          {option.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </CardFooter>
                            </Card>
                          ))
                      ) : (
                        <div className="col-span-3 text-center p-8">
                          <p className="text-muted-foreground">No {status} print jobs found</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}