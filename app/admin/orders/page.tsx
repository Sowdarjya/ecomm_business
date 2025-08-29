"use client";

import React, { useEffect, useState } from "react";
import { getAllOrders } from "@/actions/order.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getAllOrders();
      if (result.success) {
        console.log(result);

        setOrders(result.orders ?? []);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="p-4 text-center text-gray-500">Loading orders...</p>;
  }

  if (!orders.length) {
    return <p className="p-4 text-center text-gray-500">No orders found</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Orders</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orders.map((order) => (
          <Card key={order.id} className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Order #{order.id.slice(-6)}</span>
                <Badge
                  variant={
                    order.status === "PENDING"
                      ? "default"
                      : order.status === "COMPLETED"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {order.status}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* 🆕 Show user info */}
              <div className="flex items-center gap-2 mt-2">
                {order.user.avatarUrl && (
                  <img
                    src={order.user.avatarUrl}
                    alt={order.user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {order.user.fullName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {order.user.email}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm font-medium mb-2">
                <span className="text-gray-500">Location:</span>{" "}
                {order.location}
              </p>
              <p className="text-sm font-medium mb-2">
                <span className="text-gray-500">Total:</span> ₹
                {order.totalPrice}
              </p>

              <ScrollArea className="h-32 mt-2">
                <div className="space-y-3">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b pb-2"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {item.product.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          Qty: {item.quantity} | Size: {item.size}
                        </span>
                        <span className="text-xs text-gray-500">
                          ₹{item.product.price} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
