"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronDown, Eye } from "lucide-react"

// Status badge colors mapping
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  shipped: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  delivered: "bg-green-100 text-green-800 hover:bg-green-200",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
}

// Mock data moved outside component to prevent recreation on each render
const INITIAL_ORDERS = [
  {
    id: "ORD-001",
    date: new Date("2023-03-15"),
    customer: "John Smith",
    items: [
      { name: "Wireless Headphones", quantity: 1, price: 89.99 },
      { name: "Phone Case", quantity: 2, price: 19.99 },
    ],
    total: 129.97,
    status: "pending",
  },
  {
    id: "ORD-002",
    date: new Date("2023-03-14"),
    customer: "Sarah Johnson",
    items: [{ name: "Smart Watch", quantity: 1, price: 199.99 }],
    total: 199.99,
    status: "processing",
  },
  {
    id: "ORD-003",
    date: new Date("2023-03-13"),
    customer: "Michael Brown",
    items: [
      { name: "Bluetooth Speaker", quantity: 1, price: 79.99 },
      { name: "USB Cable", quantity: 3, price: 9.99 },
    ],
    total: 109.96,
    status: "shipped",
  },
  {
    id: "ORD-004",
    date: new Date("2023-03-12"),
    customer: "Emily Davis",
    items: [
      { name: "Laptop Sleeve", quantity: 1, price: 29.99 },
      { name: "Wireless Mouse", quantity: 1, price: 24.99 },
      { name: "HDMI Cable", quantity: 1, price: 14.99 },
    ],
    total: 69.97,
    status: "delivered",
  },
  {
    id: "ORD-005",
    date: new Date("2023-03-11"),
    customer: "David Wilson",
    items: [{ name: "External Hard Drive", quantity: 1, price: 119.99 }],
    total: 119.99,
    status: "cancelled",
  },
  {
    id: "ORD-006",
    date: new Date("2023-03-10"),
    customer: "Jessica Martinez",
    items: [
      { name: "Wireless Keyboard", quantity: 1, price: 59.99 },
      { name: "Monitor Stand", quantity: 1, price: 34.99 },
    ],
    total: 94.98,
    status: "pending",
  },
  {
    id: "ORD-007",
    date: new Date("2023-03-09"),
    customer: "Robert Taylor",
    items: [
      { name: "Webcam", quantity: 1, price: 49.99 },
      { name: "Microphone", quantity: 1, price: 39.99 },
    ],
    total: 89.98,
    status: "processing",
  },
  {
    id: "ORD-008",
    date: new Date("2023-03-08"),
    customer: "Jennifer Anderson",
    items: [
      { name: "Tablet", quantity: 1, price: 299.99 },
      { name: "Screen Protector", quantity: 1, price: 14.99 },
    ],
    total: 314.98,
    status: "shipped",
  },
]

export default function OrdersTable({ searchQuery = "", statusFilter = "all" }) {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  // Use memoization to avoid recalculating filtered orders on every render
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Apply search filter
      const matchesSearch = searchQuery
        ? order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      // Apply status filter
      const matchesStatus = 
        statusFilter === "all" ? true :
        statusFilter === "pending" ? ["pending", "processing"].includes(order.status) :
        statusFilter === "completed" ? ["shipped", "delivered"].includes(order.status) :
        order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchQuery, statusFilter])

  // Helper function for status badge
  const getStatusBadge = (status) => {
    const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800"
    return (
      <Badge className={`${colorClass} capitalize`} variant="outline">
        {status}
      </Badge>
    )
  }

  // Handler functions
  const handleStatusChange = () => {
    if (!selectedOrder || !newStatus) return

    setOrders(orders.map((order) => 
      order.id === selectedOrder.id ? { ...order, status: newStatus } : order
    ))
    setIsStatusDialogOpen(false)
  }

  const openStatusDialog = (order) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsStatusDialogOpen(true)
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  // Extract order item summary for table display
  const getOrderSummary = (items) => {
    return items.length === 1
      ? items[0].name
      : `${items[0].name} + ${items.length - 1} more`
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.date.toLocaleDateString()}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{getOrderSummary(order.items)}</TableCell>
                  <TableCell>${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto font-normal" 
                      onClick={() => openStatusDialog(order)}
                    >
                      {getStatusBadge(order.status)}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openStatusDialog(order)}>
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                Placed on {selectedOrder.date.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Customer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{selectedOrder.customer}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center">
                    {getStatusBadge(selectedOrder.status)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-7 text-xs"
                      onClick={() => {
                        setIsDetailsOpen(false)
                        openStatusDialog(selectedOrder)
                      }}
                    >
                      Update
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between py-1">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-muted-foreground ml-2">x{item.quantity}</span>
                        </div>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>Change the status for order {selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusChange}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}