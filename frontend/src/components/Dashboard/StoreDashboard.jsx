"use client"

import { useState } from "react"
import { StoreItem }from "@/components/Dashboard/Store/StoreItem"
import Cart  from "@/components/Dashboard/Store/Cart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Updated items with categories
const items = [
  // Books
  { id: 1, name: "Physics Textbook", price: 79.99, category: "books" },
  { id: 2, name: "Calculus Handbook", price: 64.99, category: "books" },
  { id: 3, name: "Computer Science Fundamentals", price: 89.99, category: "books" },
  { id: 4, name: "Literature Anthology", price: 49.99, category: "books" },

  // Stationery
  { id: 5, name: "Notebook (5-pack)", price: 12.99, category: "stationery" },
  { id: 6, name: "Premium Pen Set", price: 18.99, category: "stationery" },
  { id: 7, name: "Scientific Calculator", price: 24.99, category: "stationery" },
  { id: 8, name: "Highlighters (Assorted)", price: 8.99, category: "stationery" },

  // Medicines
  { id: 9, name: "Pain Reliever", price: 7.99, category: "medicines" },
  { id: 10, name: "Cold & Flu Medicine", price: 9.99, category: "medicines" },
  { id: 11, name: "Allergy Relief", price: 12.99, category: "medicines" },
  { id: 12, name: "First Aid Kit", price: 19.99, category: "medicines" },
]

export default function StoreDashboard() {
  const [cart, setCart] = useState([])
  const [orders, setOrders] = useState([])
  const [categoryTab, setCategoryTab] = useState("books")

  const addToCart = (id) => {
    const item = items.find((item) => item.id === id)
    if (!item) return

    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === id)
      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        return [...currentCart, { ...item, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id))
  }

  const checkout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create a copy of cart items for the order
    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
    }))

    const newOrder = {
      id: orders.length + 1,
      date: new Date().toLocaleDateString(),
      status: "pending",
      total,
      items: orderItems,
    }

    setOrders([newOrder, ...orders])
    setCart([])
  }

  // Filter items by category
  const filteredItems = items.filter((item) => item.category === categoryTab)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Campus Store</h2>
        <Cart items={cart} onRemoveFromCart={removeFromCart} onCheckout={checkout} />
      </div>
      <Tabs defaultValue="items" className="w-full">
        <TabsList>
          <TabsTrigger value="items">Store Items</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          <div className="mb-4">
            <Tabs
              value={categoryTab}
              onValueChange={(value) => setCategoryTab(value)}
            >
              <TabsList>
                <TabsTrigger value="books">Books</TabsTrigger>
                <TabsTrigger value="stationery">Stationery</TabsTrigger>
                <TabsTrigger value="medicines">Medicines</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <StoreItem key={item.id} {...item} onAddToCart={addToCart} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <ScrollArea className="h-[calc(100vh-200px)]">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.id} className="mb-4 p-4 border rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <span className="text-sm text-gray-500">{order.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="capitalize text-sm">{order.status}</span>
                    <span className="font-semibold">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="mt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          View Order Summary
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[625px]">
                        <DialogHeader>
                          <DialogTitle>Order Summary #{order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Subtotal</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {order.items.map((item) => (
                                <TableRow key={item.id}>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell className="capitalize">{item.category}</TableCell>
                                  <TableCell className="text-center">{item.quantity}</TableCell>
                                  <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                  <TableCell className="text-right">
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell colSpan={4} className="text-right font-bold">
                                  Total:
                                </TableCell>
                                <TableCell className="text-right font-bold">${order.total.toFixed(2)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">No orders yet.</p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}