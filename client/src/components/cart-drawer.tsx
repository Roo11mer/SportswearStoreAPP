import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";

type CartItemWithProduct = CartItem & {
  product: Product;
};

export default function CartDrawer() {
  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const itemCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const subtotal = cartItems?.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  ) || 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount} items)</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-20 w-20" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : !cartItems?.length ? (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <ShoppingCart className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Your cart is empty</p>
            <Button asChild>
              <Link href="/">Shop Now</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 -mx-6 px-6 my-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-2 border rounded-lg bg-card"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="font-medium">
                          ${formatCurrency(Number(item.product.price))}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between font-medium">
                <span>Subtotal</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>
              <Button asChild className="w-full">
                <Link href="/cart">View Cart & Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
