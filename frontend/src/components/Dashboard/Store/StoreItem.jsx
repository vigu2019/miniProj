"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function StoreItem({ id, name, price, category, onAddToCart }) {
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant="outline" className="capitalize">
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">₹{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddToCart(id)} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}