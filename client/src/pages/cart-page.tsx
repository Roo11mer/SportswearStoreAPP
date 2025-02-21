import { useQuery, useMutation } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type CartItemWithProduct = CartItem & {
  product: Product;
};

export default function CartPage() {
  const { toast } = useToast();

  const { data: cartItems, isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-24 w-24" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cartItems?.length) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any items to your cart yet.
        </p>
        <Button asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border rounded-lg bg-card"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-24 w-24 object-cover rounded"
              />
              <div className="flex-1 space-y-2">
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                <p className="font-medium">
                  ${formatCurrency(Number(item.product.price))}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateQuantityMutation.mutate({
                        id: item.id,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      updateQuantityMutation.mutate({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-auto text-destructive"
                    onClick={() => removeItemMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-card">
            <h3 className="font-medium mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="pt-2 border-t flex justify-between font-medium">
                <span>Total</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>
            </div>
            <Button className="w-full mt-4" size="lg">
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
