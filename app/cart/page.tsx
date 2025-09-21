"use client";

import { getUserCartItems, removeCartItem } from "@/actions/product.action";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react";
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
import {
  getDefaultAddress,
  setDefaultAddress,
  getDefaultPhone,
  setDefaultPhone,
} from "@/actions/user.action";

const CartPage = () => {
  type CartItem = {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
    size: string | null;
    product: {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      description: string;
      price: number;
      images: string[];
      category: "CLOTHING" | "ACCESSORIES";
      size: string[];
      stock: number;
    };
  };

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [setAsDefaultAddress, setSetAsDefaultAddress] = useState(false);
  const [setAsDefaultPhone, setSetAsDefaultPhone] = useState(false);
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
      console.error(error);
      toast.error("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultDetails = async () => {
    try {
      const addressResult = await getDefaultAddress();
      if (addressResult.success) {
        setAddress(addressResult.address || "");
      }

      const phoneResult = await getDefaultPhone();
      if (phoneResult.success) {
        setContactNo(phoneResult.phone || "");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error("Please enter your address");
      return;
    }

    if (!contactNo.trim()) {
      toast.error("Please enter your contact number");
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[+]?[1-9][\d\s\-\(\)]{7,14}$/;
    if (!phoneRegex.test(contactNo.trim())) {
      toast.error("Please enter a valid contact number");
      return;
    }

    setIsPlacingOrder(true);
    try {
      if (setAsDefaultAddress) {
        const setDefaultAddressResult = await setDefaultAddress(address);
        if (!setDefaultAddressResult.success) {
          toast.error("Failed to set default address");
          return;
        }
      }

      if (setAsDefaultPhone) {
        const setDefaultPhoneResult = await setDefaultPhone(contactNo);
        if (!setDefaultPhoneResult.success) {
          toast.error("Failed to set default phone number");
          return;
        }
      }

      const result = await placeOrder(address, contactNo);
      if (result.success) {
        toast.success("Order placed successfully!");
        setIsCheckoutOpen(false);
        setCartItems([]);
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const removeItem = async (itemId: string) => {
    try {
      await removeCartItem(itemId);
      fetchCartItems();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove item");
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  // Shipping removed; always zero
  const shipping = 0;
  const total = subtotal;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4" />
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
            <Link href="/">
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

                          <div className="flex gap-4 mt-1">
                            <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                              {item.product.category}
                            </span>
                            {item.product.size && (
                              <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                                Size: {item.size}
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
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Delivery Charge</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t border-amber-200 pt-4">
                    <div className="flex justify-between text-xl font-bold text-amber-900">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </div>

                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                      onClick={fetchDefaultDetails}
                    >
                      Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-amber-900 flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Checkout Details
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-amber-800 flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4" />
                          Delivery Address
                        </Label>
                        <Input
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your complete address"
                          className="border-amber-200 focus:border-amber-400"
                        />
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            id="setDefaultAddress"
                            checked={setAsDefaultAddress}
                            onCheckedChange={(checked) =>
                              setSetAsDefaultAddress(checked === true)
                            }
                            className="border-amber-300"
                          />
                          <Label
                            htmlFor="setDefaultAddress"
                            className="text-sm text-amber-700"
                          >
                            Set as default address
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="contactNo"
                          className="text-amber-800 flex items-center gap-2"
                        >
                          <Phone className="h-4 w-4" />
                          Contact Number
                        </Label>
                        <Input
                          id="contactNo"
                          value={contactNo}
                          onChange={(e) => setContactNo(e.target.value)}
                          placeholder="Enter your phone number"
                          className="border-amber-200 focus:border-amber-400"
                          type="tel"
                        />
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox
                            id="setDefaultPhone"
                            checked={setAsDefaultPhone}
                            onCheckedChange={(checked) =>
                              setSetAsDefaultPhone(checked === true)
                            }
                            className="border-amber-300"
                          />
                          <Label
                            htmlFor="setDefaultPhone"
                            className="text-sm text-amber-700"
                          >
                            Set as default phone number
                          </Label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-amber-800 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment Method
                        </Label>
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                          <p className="text-amber-700 font-medium">
                            Cash on Delivery
                          </p>
                          <p className="text-xs text-amber-600 mt-1">
                            We only accept COD now. Pay when your order is
                            delivered.
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold text-amber-900 mb-4">
                          <span>Total Amount:</span>
                          <span>₹{total}</span>
                        </div>
                        <Button
                          onClick={handleCheckout}
                          disabled={
                            isPlacingOrder ||
                            !address.trim() ||
                            !contactNo.trim()
                          }
                          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white cursor-pointer"
                        >
                          {isPlacingOrder ? "Placing Order..." : "Place Order"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
