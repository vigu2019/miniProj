import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";

export default function Cart({ items, onRemoveFromCart, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-8 space-y-4">
          <ScrollArea className="h-[60vh]">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                <Button variant="destructive" size="sm" onClick={() => onRemoveFromCart(item.id)}>
                  Remove
                </Button>
              </div>
            ))}
          </ScrollArea>
          <div className="text-xl font-bold">Total: ₹{total.toFixed(2)}</div>
          <Button onClick={onCheckout} className="w-full">
            Checkout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
