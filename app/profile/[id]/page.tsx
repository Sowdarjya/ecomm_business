"use client";

import { getUserOrders, cancelOrder } from "@/actions/order.action";
import { getUserById, setDefaultAddress } from "@/actions/user.action";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type User = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  address: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
};

type OrderItem = {
  id: string;
  quantity: number;
  size: string;
  orderId: string;
  productId: string;
  product: Product;
};

type Order = {
  id: string;
  status: string;
  totalPrice: number;
  location: string;
  createdAt: Date;
  items: OrderItem[];
};

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);

  const fetchUserDetails = async (userId: string) => {
    try {
      const res = await getUserById(userId);
      if (res.success) {
        setUser(res?.user || null);
        setNewAddress(res?.user?.address || "");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user details");
    }
  };

  const fetchUserOrders = async () => {
    try {
      const res = await getUserOrders();
      if (res.success) {
        setOrders((res?.orders as Order[]) || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user orders");
    } finally {
      setLoading(false);
    }
  };

  const handleAddressUpdate = async () => {
    try {
      if (!newAddress.trim()) {
        toast.error("Address cannot be empty");
        return;
      }
      const res = await setDefaultAddress(newAddress);
      if (res.success) {
        setUser((prev) => (prev ? { ...prev, address: newAddress } : prev));
        toast.success("Address updated successfully");
        setEditingAddress(false);
      } else {
        toast.error(res.message || "Failed to update address");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating address");
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrder(orderId);
    try {
      const res = await cancelOrder(orderId);
      if (res.success) {
        toast.success("Order cancelled successfully");
        // Update the order status locally to avoid refetching
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, status: "CANCELLED" } : order
          )
        );
      } else {
        toast.error(res.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error cancelling order");
    } finally {
      setCancellingOrder(null);
    }
  };

  const canCancelOrder = (status: string) => {
    return status === "PENDING" || status === "CONFIRMED";
  };

  useEffect(() => {
    if (id) {
      fetchUserDetails(id.toString());
      fetchUserOrders();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <p className="text-amber-700 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex items-center justify-center">
        <p className="text-amber-700 text-lg">User not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* User Info */}
        <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
          <CardHeader className="flex items-center gap-4">
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              className="w-20 h-20 rounded-full border-4 border-amber-300 object-cover"
            />
            <div>
              <CardTitle className="text-2xl text-amber-900">
                {user.fullName}
              </CardTitle>
              <p className="text-amber-700">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-amber-800 font-medium">
                Address:{" "}
                {editingAddress ? (
                  <Input
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full max-w-md inline-block"
                  />
                ) : (
                  <span className="text-amber-700">{user.address}</span>
                )}
              </p>
              {editingAddress ? (
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddressUpdate}
                    className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white cursor-pointer"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-400 text-amber-700 hover:bg-amber-100 cursor-pointer"
                    onClick={() => {
                      setEditingAddress(false);
                      setNewAddress(user.address);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setEditingAddress(true)}
                  className="border-amber-400 text-amber-700 hover:bg-amber-100 cursor-pointer"
                >
                  Edit
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-md border-amber-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-amber-900">My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-amber-700">You have no orders yet.</p>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-amber-200 rounded-lg p-6 hover:shadow-md transition bg-white"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-amber-900 font-semibold text-lg">
                          Order #{order.id.slice(-6)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Placed on:{" "}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${
                            order.status === "PENDING"
                              ? "bg-yellow-500"
                              : order.status === "COMPLETED"
                              ? "bg-green-500"
                              : order.status === "CANCELLED"
                              ? "bg-gray-500"
                              : "bg-red-500"
                          } text-white`}
                        >
                          {order.status}
                        </Badge>
                        {canCancelOrder(order.status) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancellingOrder === order.id}
                            className="border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            {cancellingOrder === order.id
                              ? "Cancelling..."
                              : "Cancel Order"}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-16 h-16 rounded-md object-cover border border-amber-200"
                          />

                          <div className="flex-1">
                            <h4 className="font-semibold text-amber-900">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-1">
                              {item.product.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-amber-700">
                                Size: <strong>{item.size}</strong>
                              </span>
                              <span className="text-amber-700">
                                Qty: <strong>{item.quantity}</strong>
                              </span>
                              <span className="text-amber-700">
                                Price: <strong>₹{item.product.price}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-amber-900">
                              ₹{item.product.price * item.quantity}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.quantity} × ₹{item.product.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-amber-200">
                      <div className="text-sm text-gray-600">
                        <p>Delivery to: {order.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-amber-900">
                          Total: ₹{order.totalPrice}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
