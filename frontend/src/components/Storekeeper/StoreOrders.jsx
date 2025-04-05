"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
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
import { ChevronDown, Eye, Loader2 } from "lucide-react"
import { urls } from "@/utils/urls"
import { toast } from "react-toastify"

// Status badge colors mapping
const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
}

// Fallback mock data for development purposes
const FALLBACK_ORDERS = [
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
  // ... other mock orders
]

export default function OrdersTable({ searchQuery = "", statusFilter = "all" }) {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")
        const response = await axios.get(urls.getUserOrders, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
        )
        console.log("Response data:", response) // Debugging line
        
        if (!response.data.success) {
          throw new Error('Failed to fetch orders')
        }
        
        // Convert string dates to Date objects
        const ordersWithDates = response.data.items.map(order => ({
          ...order,
          date: new Date(order.date)
        }))
        
        setOrders(ordersWithDates)
        setError(null)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to load orders. Please try again later.')
        // Use fallback data in development
        if (process.env.NODE_ENV === 'development') {
          setOrders(FALLBACK_ORDERS)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem("token")
      //pass orderId and status to the API anad add headers
      const response = await axios.put(urls.updateOrderStatus, {
        orderId,
        status,
      }, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      if(!response.data.success) {
        throw new Error('Failed to update order status')
      }
      // Update local state after successful API call
      setOrders(orders.map((order) => 
        order.id === orderId ? { ...order, status } : order
      ))
      toast.success(`Order status updated to ${status}`)
      return true
    } catch (err) {
      console.error('Error updating order status:', err)
      return false
    }
  }

  // Use memoization to avoid recalculating filtered orders on every render
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Apply search filter
      const matchesSearch = searchQuery
        ? order.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      // Apply status filter
      const matchesStatus = 
        statusFilter === "all" ? true :
        statusFilter === "pending" ? ["pending"].includes(order.status) :
        statusFilter === "completed" ? ["completed"].includes(order.status) :
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
  const handleStatusChange = async () => {
    if (!selectedOrder || !newStatus) return

    const success = await updateOrderStatus(selectedOrder.id, newStatus)
    
    if (success) {
      setIsStatusDialogOpen(false)
    } else {
      // Handle error - could show a toast notification here
      toast.error("Failed to update order status")
    }
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
    if (!items || items.length === 0) return "No items"
    return items.length === 1
      ? items[0].name
      : `${items[0].name} + ${items.length - 1} more`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading orders...</span>
      </div>
    )
  }

  if (error && orders.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md">
        <p className="text-red-500">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
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
                {/* <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem> */}
                <SelectItem value="completed">Completed</SelectItem>
                {/* <SelectItem value="cancelled">Cancelled</SelectItem> */}
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