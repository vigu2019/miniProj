"use client"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentViewer } from "@/components/PrintStaff/DocumentView"

// Update the mock data to include the requested fields
const initialPrintJobs = [
  {
    id: "PJ001",
    customerName: "John Doe",
    documentName: "Annual Report.pdf",
    pages: 24,
    copies: 2,
    printType: "Color",
    printSide: "Double-sided",
    description: "Company annual financial report with charts and graphs",
    status: "pending",
    submittedAt: "2023-06-15T10:30:00",
  },
  {
    id: "PJ002",
    customerName: "Jane Smith",
    documentName: "Marketing Brochure.pdf",
    pages: 8,
    copies: 50,
    printType: "Color",
    printSide: "Single-sided",
    description: "Product marketing materials for trade show",
    status: "printing",
    submittedAt: "2023-06-15T11:45:00",
  },
  {
    id: "PJ003",
    customerName: "Robert Johnson",
    documentName: "Conference Handouts.pdf",
    pages: 12,
    copies: 100,
    printType: "Black & White",
    printSide: "Double-sided",
    description: "Handouts for industry conference next week",
    status: "completed",
    submittedAt: "2023-06-14T09:15:00",
  },
  {
    id: "PJ004",
    customerName: "Emily Davis",
    documentName: "Thesis Paper.pdf",
    pages: 120,
    copies: 3,
    printType: "Black & White",
    printSide: "Double-sided",
    description: "Final thesis paper for university submission",
    status: "pending",
    submittedAt: "2023-06-15T14:20:00",
  },
  {
    id: "PJ005",
    customerName: "Michael Wilson",
    documentName: "Product Catalog.pdf",
    pages: 32,
    copies: 25,
    printType: "Color",
    printSide: "Double-sided",
    description: "Updated product catalog with new items",
    status: "failed",
    submittedAt: "2023-06-15T08:30:00",
  },
]

// Status options for dropdown
const statusOptions = [
  { value: "pending", label: "Pending", icon: Hourglass },
  { value: "printing", label: "Printing", icon: Printer },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
  { value: "failed", label: "Failed", icon: AlertCircle },
]

export function PrintShopkeeperDashboard() {
  const [printJobs, setPrintJobs] = useState(initialPrintJobs)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedDocument, setSelectedDocument] = useState(null)

  // Filter print jobs based on search query and status filter
  const filteredPrintJobs = printJobs.filter((job) => {
    const matchesSearch =
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || job.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Update job status
  const updateJobStatus = (jobId, newStatus) => {
    setPrintJobs((prevJobs) => prevJobs.map((job) => (job.id === jobId ? { ...job, status: newStatus } : job)))
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
      case "printing":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Printing
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
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Update the printDocument function to include only the requested fields
  const printDocument = (job) => {
    // Create a new window for printing
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      // Create the print content with only the requested fields
      printWindow.document.write(`
      <html>
        <head>
          <title>Print Job: ${job.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              max-width: 800px;
              margin: 0 auto;
            }
            .header {
              border-bottom: 1px solid #ddd;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .content {
              margin-top: 30px;
            }
            .page-info {
              text-align: center;
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            }
            .meta {
              color: #666;
              font-size: 14px;
              margin-bottom: 5px;
            }
            .field {
              margin-bottom: 15px;
            }
            .field-label {
              font-weight: bold;
              display: inline-block;
              width: 120px;
            }
            .document-preview {
              border: 1px solid #ddd;
              padding: 20px;
              margin-top: 20px;
              background-color: #f9f9f9;
            }
            @media print {
              body {
                padding: 0;
              }
              .no-print {
                display: none;
              }
              .document-preview {
                border: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Print Job: ${job.id}</h1>
          </div>
          <div class="content">
            <div class="field">
              <span class="field-label">Print Type:</span> ${job.printType}
            </div>
            <div class="field">
              <span class="field-label">Copies:</span> ${job.copies}
            </div>
            <div class="field">
              <span class="field-label">Customer:</span> ${job.customerName}
            </div>
            <div class="field">
              <span class="field-label">Print Side:</span> ${job.printSide}
            </div>
            <div class="field">
              <span class="field-label">Description:</span> ${job.description}
            </div>
            <div class="field">
              <span class="field-label">Uploaded At:</span> ${formatDate(job.submittedAt)}
            </div>
            <div class="field">
              <span class="field-label">Status:</span> ${job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </div>
            <div class="field">
              <span class="field-label">File:</span> ${job.documentName}
            </div>
            
            <div class="document-preview">
              <h3>Document Preview</h3>
              <p>This is a preview of "${job.documentName}"</p>
              <div style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px;">
                <p>Document content would appear here in a real implementation.</p>
              </div>
            </div>
          </div>
          <div class="page-info">
            Print Job #${job.id} - Generated on ${new Date().toLocaleString()}
          </div>
          <div class="no-print" style="margin-top: 30px; text-align: center;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Document
            </button>
          </div>
        </body>
      </html>
    `)

      printWindow.document.close()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Printer className="h-5 w-5" />
          Print Shopkeeper Dashboard
        </h1>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Settings className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Settings</span>
          </Button>
          <Button size="sm" className="h-8 gap-1">
            <User className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Account</span>
          </Button>
        </div>
      </header>
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
                    <SelectItem value="printing">Printing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm" className="h-8" onClick={() => setPrintJobs(initialPrintJobs)}>
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:w-auto">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="printing">Printing</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrintJobs.map((job) => (
                  <Card key={job.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{job.documentName}</CardTitle>
                          <CardDescription>{job.customerName}</CardDescription>
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
                            <DropdownMenuItem onClick={() => setSelectedDocument(job)}>View Document</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => printDocument(job)}>Print Document</DropdownMenuItem>
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
                          <span>{job.printType}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Copies</span>
                          <span>{job.copies}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-muted-foreground">Print Side</span>
                          <span>{job.printSide}</span>
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
                          <span className="truncate">{job.description}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between p-4 pt-0">
                      <Button variant="outline" size="sm" onClick={() => setSelectedDocument(job)}>
                        <FileText className="mr-2 h-4 w-4" />
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
                ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrintJobs
                  .filter((job) => job.status === "pending")
                  .map((job) => (
                    <Card key={job.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{job.documentName}</CardTitle>
                            <CardDescription>{job.customerName}</CardDescription>
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
                              <DropdownMenuItem onClick={() => setSelectedDocument(job)}>
                                View Document
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => printDocument(job)}>Print Document</DropdownMenuItem>
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
                            <span>{job.printType}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Copies</span>
                            <span>{job.copies}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Print Side</span>
                            <span>{job.printSide}</span>
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
                            <span className="truncate">{job.description}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDocument(job)}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Document
                        </Button>
                        <Button size="sm" onClick={() => updateJobStatus(job.id, "printing")}>
                          <Printer className="mr-2 h-4 w-4" />
                          Start Printing
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="printing" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrintJobs
                  .filter((job) => job.status === "printing")
                  .map((job) => (
                    <Card key={job.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{job.documentName}</CardTitle>
                            <CardDescription>{job.customerName}</CardDescription>
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
                              <DropdownMenuItem onClick={() => setSelectedDocument(job)}>
                                View Document
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => printDocument(job)}>Print Document</DropdownMenuItem>
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
                            <span>{job.printType}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Copies</span>
                            <span>{job.copies}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Print Side</span>
                            <span>{job.printSide}</span>
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
                            <span className="truncate">{job.description}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDocument(job)}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Document
                        </Button>
                        <Button size="sm" onClick={() => updateJobStatus(job.id, "completed")}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Completed
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrintJobs
                  .filter((job) => job.status === "completed")
                  .map((job) => (
                    <Card key={job.id} className="overflow-hidden">
                      <CardHeader className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{job.documentName}</CardTitle>
                            <CardDescription>{job.customerName}</CardDescription>
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
                              <DropdownMenuItem onClick={() => setSelectedDocument(job)}>
                                View Document
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => printDocument(job)}>Print Document</DropdownMenuItem>
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
                            <span>{job.printType}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Copies</span>
                            <span>{job.copies}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-muted-foreground">Print Side</span>
                            <span>{job.printSide}</span>
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
                            <span className="truncate">{job.description}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button variant="outline" size="sm" onClick={() => setSelectedDocument(job)}>
                          <FileText className="mr-2 h-4 w-4" />
                          View Document
                        </Button>
                        <Button variant="outline" size="sm">
                          <Clock className="mr-2 h-4 w-4" />
                          Archive
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedDocument.documentName}</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDocument(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <DocumentViewer document={selectedDocument} />
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                Close
              </Button>
              <Button variant="outline" onClick={() => printDocument(selectedDocument)}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
              <Button>Download</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

