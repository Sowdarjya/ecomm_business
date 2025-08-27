"use client";

import { getUserCartItems } from "@/actions/product.action";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { placeOrder } from "@/actions/order.action";
import { getDefaultAddress, setDefaultAddress } from "@/actions/user.action";

const CartPage = () => {
  type CartItem = {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    product: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      description: string;
      price: number;
      images: string[];
      category: "CLOTHING" | "ACCESSORIES";
      size: string | null;
      stock: number;
    };
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const items = await getUserCartItems();

      if (items.success) {
        setCartItems(items.items ?? []);
      } else {
        toast.error(items.message || "Failed to fetch cart items");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultAddress = async () => {
    try {
      const result = await getDefaultAddress();
      if (result.success) {
        setAddress(result.address || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    setIsPlacingOrder(true);
    try {
      // Set as default address if checkbox is checked
      if (setAsDefault) {
        const setDefaultResult = await setDefaultAddress(address);
        if (!setDefaultResult.success) {
          toast.error("Failed to set default address");
          return;
        }
      }

      // Place the order
      const result = await placeOrder(address);
      if (result.success) {
        toast.success("Order placed successfully!");
        setIsCheckoutOpen(false);
        setCartItems([]);
        // Optionally redirect to order confirmation page
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success("Item removed from cart");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 1000 ? 0 : 50;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-24 w-24 text-amber-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-amber-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-amber-700 mb-8">Add your favorite products</p>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-full">
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">Your Cart</h1>
          <p className="text-amber-700">Your selected products</p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card
                key={item.id}
                className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-amber-100">
                      <Image
                        src={
                          item.product.images[0] ||
                          "/placeholder.svg?height=96&width=96"
                        }
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-amber-900 text-lg">
                            {item.product.name}
                          </h3>
                          <p className="text-amber-700 text-sm">
                            {item.product.description}
                          </p>
                          <div className="flex gap-4 mt-1">
                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                              {item.product.category}
                            </span>
                            {item.product.size && (
                              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                Size: {item.product.size}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0 border-amber-300 hover:bg-amber-50"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium text-amber-900 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.product.stock}
                            className="h-8 w-8 p-0 border-amber-300 hover:bg-amber-50"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-900">
                            ₹
                            {(
                              item.product.price * item.quantity
                            ).toLocaleString()}
                          </p>
                          <p className="text-sm text-amber-600">
                            ₹{item.product.price} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200 shadow-xl sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-amber-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-amber-800">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-amber-800">
                    <span>Delivery Charge</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">
                      Free delivery on orders ₹1000+!
                    </p>
                  )}
                  <div className="border-t border-amber-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-amber-900">
                      <span>Total</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={fetchDefaultAddress}
                    >
                      Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-amber-900">
                        Checkout
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-amber-800">
                          Delivery Address
                        </Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your complete address"
                          className="border-amber-200 focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="setDefault"
                          checked={setAsDefault}
                          onCheckedChange={(checked) =>
                            setSetAsDefault(checked === true)
                          }
                          className="border-amber-300"
                        />

                        <Label
                          htmlFor="setDefault"
                          className="text-sm text-amber-700"
                        >
                          Set as default address
                        </Label>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold text-amber-900 mb-4">
                          <span>Total Amount:</span>
                          <span>₹{total.toLocaleString()}</span>
                        </div>

                        <Button
                          onClick={handleCheckout}
                          disabled={isPlacingOrder || !address.trim()}
                          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
                        >
                          {isPlacingOrder ? "Placing Order..." : "Place Order"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Benefits
                  </h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• 7 day return policy</li>
                    <li>• Cash on delivery</li>
                    <li>• 24/7 customer support</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
