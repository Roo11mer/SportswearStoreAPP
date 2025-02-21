import { Product } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="h-[300px] w-full object-cover transition-transform hover:scale-105"
      />
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-muted-foreground">${product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
        <Button variant="outline" size="icon">
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
