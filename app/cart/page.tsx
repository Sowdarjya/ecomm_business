"use client";

import { getUserCartItems, removeCartItem } from "@/actions/product.action";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

  const removeItem = async (itemId: string) => {
    try {
      const res = await removeCartItem(itemId);

      if (res.success) {
        toast.success("Item removed");
        setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item");
    }
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
          <p className="text-amber-800 font-bengali">Loading...</p>
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
            <h1 className="text-3xl font-bold text-amber-900 mb-4 font-bengali">
              Your Cart is Empty
            </h1>
            <p className="text-amber-700 mb-8">Add items to your cart.</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-full font-bengali">
                Continue Shopping
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
          <h1 className="text-4xl font-bold text-amber-900 mb-2 font-bengali">
            Your Cart
          </h1>
          <p className="text-amber-700">Review your cart items</p>
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
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-amber-900 min-w-[2rem] text-center">
                            Quantity: {item.quantity}
                          </span>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-amber-900">
                            ₹{item.product.price * item.quantity}
                          </p>
                          <p className="text-sm text-amber-600">
                            ₹{item.product.price} per item
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
                <h2 className="text-2xl font-bold text-amber-900 mb-6 font-bengali">
                  Cart Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="border-t border-amber-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-amber-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-full font-bengali text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                  Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
