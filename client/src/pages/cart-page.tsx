import { useEffect } from "react";
import { Link } from "wouter";
import PageLayout from "@/components/layout/page-layout";
import CartItem from "@/components/store/cart-item";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, ArrowRight, AlertTriangle } from "lucide-react";

export default function CartPage() {
  const { items, totalItems, totalPrice, clearCart } = useCart();

  // Set page title
  useEffect(() => {
    document.title = "Shopping Cart - S3vn Studies";
  }, []);

  // Format price from cents to dollars
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
          <h1 className="text-3xl font-bold font-poppins mb-8">Shopping Cart</h1>
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild size="lg">
              <Link href="/store">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold font-poppins mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Cart Items ({totalItems})</h2>
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    Clear Cart
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    product={item.product}
                    quantity={item.quantity}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden sticky top-24">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Order Summary</h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span>{totalPrice >= 5000 ? "Free" : formatPrice(799)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax</span>
                    <span>{formatPrice(Math.round(totalPrice * 0.07))}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        totalPrice +
                          (totalPrice >= 5000 ? 0 : 799) +
                          Math.round(totalPrice * 0.07)
                      )}
                    </span>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary-dark text-white"
                    size="lg"
                  >
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>

                  <div className="flex items-start mt-6 text-sm text-neutral-600">
                    <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    <p>
                      This is a demo store. No real transactions will be processed
                      and no physical products will be shipped.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
