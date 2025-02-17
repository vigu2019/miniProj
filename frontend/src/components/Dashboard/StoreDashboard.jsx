"use client";

import { useState } from "react";
import StoreItem from "./Store/StoreItem";
import Cart from "./Store/Cart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const items = [
  { id: 1, name: "Notebook", price: 4.99 },
  { id: 2, name: "Pen Set", price: 12.99 },
  { id: 3, name: "Backpack", price: 39.99 },
  { id: 4, name: "Calculator", price: 19.99 },
  { id: 5, name: "Textbook", price: 79.99 },
];

export default function StoreDashboard() {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  const addToCart = (id) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.id === id);
      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...currentCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  const checkout = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = {
      id: orders.length + 1,
      date: new Date().toLocaleDateString(),
      status: "pending",
      total,
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item) => (
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
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 mt-4">No orders yet.</p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
