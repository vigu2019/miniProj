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
  { id: 1, name: "Ruled Book-100pg", price: 20.00, category: "books" },
  { id: 2, name: "Ruled Book-200pg", price: 50.00, category: "books" },
  { id: 3, name: "UnRuled Book-100pg", price: 20.00, category: "books" },
  { id: 4, name: "UnRuled Book-200pg", price: 50.00, category: "books" },
  { id: 5, name: "Rough Record", price: 50.00, category: "books" },
  { id: 6, name: "Fair Record(graph)", price: 95.00, category: "books" },
  { id: 7, name: "Fair Record(without graph)", price: 95.00, category: "books" },
  { id: 8, name: "Assignment Book", price: 20.00, category: "books" },
  { id: 9, name: "A4 sheet(pack of 5)", price: 5.00, category: "books" },
  { id: 10, name: "Graph Paper(pack of 5)", price: 5.00, category: "books" },

  // Stationery
  { id: 11, name: "Natraj-Blue", price: 5.00, category: "stationery" },
  { id: 12, name: "Natraj-Black", price: 5.00, category: "stationery" },
  { id: 13, name: "Natraj-Red", price: 5.00, category: "stationery" },
  { id: 14, name: "Pentonic-Blue", price: 8.00, category: "stationery" },
  { id: 15, name: "Pentonic-Black", price: 8.00, category: "stationery" },
  { id: 16, name: "Pentonic-Red", price: 8.00, category: "stationery" },
  { id: 17, name: "Rorito-Blue", price: 10.00, category: "stationery" },
  { id: 18, name: "Rorito-Black", price: 10.00, category: "stationery" },
  { id: 19, name: "Rorito-Red", price: 10.00, category: "stationery" },
  { id: 20, name: "Pencil", price: 1.00, category: "stationery" },
  { id: 21, name: "Graphics Pencil", price: 20.00, category: "stationery" },
  { id: 22, name: "Ruler", price: 5.00, category: "stationery" },
  { id: 23, name: "Roler Scale", price: 50.00, category: "stationery" },
  { id: 24, name: "Eraser", price: 2.00, category: "stationery" },
  { id: 25, name: "Fevicol", price: 20.00, category: "stationery" },
  { id: 26, name: "Fevistick", price: 15.00, category: "stationery" },
  { id: 27, name: "Stapler", price: 50.00, category: "stationery" },
  { id: 28, name: "Stapler pins", price: 6.30, category: "stationery" },
  { id: 29, name: "Sharpener", price: 3.00, category: "stationery" },
  { id: 30, name: "Chalks", price: 7.00, category: "stationery" },
  { id: 31, name: "Permanent Marker", price: 25.00, category: "stationery" },
  { id: 32, name: "Whiteboard Marker", price: 20.00, category: "stationery" },
  { id: 33, name: "Whitener", price: 12.00, category: "stationery" },
  { id: 34, name: "Duster", price: 45.00, category: "stationery" },
  { id: 35, name: "Protractor", price: 5.00, category: "stationery" },
  { id: 36, name: "Compass", price: 25.00, category: "stationery" },

  // Medicines
  { id: 37, name: "Paracetamol-650mg", price: 10.00, category: "medicines" },
  { id: 38, name: "Dolo-650mg", price: 25.00, category: "medicines" },
  { id: 39, name: "Mefthal-spas", price: 42.00, category: "medicines" },
  { id: 40, name: "Gelusil", price: 22.00, category: "medicines" },
  { id: 41, name: "Citirizine", price: 15.00, category: "medicines" },
  { id: 42, name: "Dettol-60ml", price: 36.59, category: "medicines" },
  { id: 43, name: "Volini-15gm", price: 64.00, category: "medicines" },
  { id: 44, name: "Sanitary Napkin-Regular", price: 37.00, category: "medicines" },
  { id: 45, name: "Calamine-30ml", price: 65.00, category: "medicines" },
  { id: 46, name: "Mask", price: 5.00, category: "medicines" },
  { id: 47, name: "Glucose-75gm", price: 34.00, category: "medicines" },
  { id: 48, name: "Vicks Balm-25ml", price: 175.00, category: "medicines" },
  { id: 49, name: "Vicks Tablet", price: 2.00, category: "medicines" },
  { id: 50, name: "Bandage", price: 242.00, category: "medicines" },
  { id: 51, name: "Bandaid", price: 10.00, category: "medicines" },
  { id: 52, name: "Neosporin Powder", price: 104.00 , category: "medicines" },
  { id: 53, name: "Tiger Balm", price: 93.00, category: "medicines" },
  { id: 54, name: "Hotwater Bag", price: 200.00, category: "medicines" },
  { id: 55, name: "Cotton", price: 174.00, category: "medicines" },
  { id: 56, name: "ORS", price: 17.00, category: "medicines" },
  { id: 57, name: "Masking Tape", price: 90.00, category: "medicines" },
  { id: 58, name: "Sanitizer-52ml", price: 33.00, category: "medicines" },
  
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