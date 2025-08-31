"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface OrderItem {
  productId: string;
  quantity: number;
}

export async function placeOrder(address: string, contactNo: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
      return {
        success: false,
        message: "Authentication required",
      };
    }

    if (!address || address.trim() === "") {
      return {
        success: false,
        message: "Address is required",
      };
    }

    if (!contactNo || contactNo.trim() === "") {
      return {
        success: false,
        message: "Contact number is required",
      };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
      };
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return {
          success: false,
          message: `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, Requested: ${item.quantity}`,
        };
      }
    }

    const totalPrice = cart.items.reduce(
      (sum: number, item: { product: { price: number }; quantity: number }) =>
        sum + item.product.price * item.quantity,
      0
    );

    const shipping = totalPrice > 1000 ? 0 : 50;
    const finalTotal = totalPrice + shipping;

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const order = await tx.order.create({
          data: {
            userId: user.id,
            totalPrice: finalTotal,
            location: address.trim(),
            contactNo: contactNo.trim(),
            status: "PENDING",
          },
        });

        const orderItems = await Promise.all(
          cart.items.map(
            (item: {
              productId: string;
              quantity: number;
              size: string | null;
            }) =>
              tx.orderItem.create({
                data: {
                  orderId: order.id,
                  productId: item.productId,
                  quantity: item.quantity,
                  size: item.size ?? "",
                },
              })
          )
        );

        await Promise.all(
          cart.items.map(
            (item: {
              productId: string;
              quantity: number;
              size: string | null;
            }) =>
              tx.product.update({
                where: { id: item.productId },
                data: {
                  stock: {
                    decrement: item.quantity,
                  },
                },
              })
          )
        );

        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return {
          order,
          orderItems,
        };
      }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        address: address.trim(),
        phone: contactNo.trim(),
      },
    });

    revalidatePath("/cart");
    revalidatePath("/orders");
    revalidatePath("/");

    return {
      success: true,
      message: "Order placed successfully",
      orderId: result.order.id,
      orderTotal: finalTotal,
    };
  } catch (error) {
    console.error("Error placing order:", error);
    return {
      success: false,
      message: "Failed to place order. Please try again.",
    };
  }
}

export async function getOrderById(orderId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
      return {
        success: false,
        message: "Authentication required",
      };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return {
      success: false,
      message: "Failed to fetch order details",
    };
  }
}

export async function getUserOrders() {
  try {
    console.log("=== Starting getUserOrders ===");

    const authResult = await auth();
    const { userId } = authResult;
    console.log("Auth result:", { userId, hasAuth: !!authResult });

    if (!userId) {
      console.log("No userId, redirecting to sign-in");
      redirect("/sign-in");
      return {
        success: false,
        message: "Authentication required",
      };
    }

    console.log("Looking for user with clerkId:", userId);
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    console.log("Database user found:", {
      userId: user?.id,
      clerkId: user?.clerkId,
    });

    if (!user) {
      return {
        success: false,
        message: "User not found in database",
      };
    }

    console.log("Fetching orders for userId:", user.id);
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(
      "Orders found:",
      orders.length,
      orders.map((o) => ({ id: o.id, status: o.status }))
    );

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("=== ERROR in getUserOrders ===");
    console.error("Error type:", error?.constructor?.name);
    console.error(
      "Error message:",
      error instanceof Error ? error.message : error
    );
    console.error("Full error:", error);
    return {
      success: false,
      message: `Database error: ${
        error instanceof Error ? error.message : "Unknown database error"
      }`,
    };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return {
        success: false,
        message: "Authentication required",
      };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: user.id },
      include: { items: true },
    });

    if (!order) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    if (order.status !== "PENDING") {
      return {
        success: false,
        message: "Only pending orders can be cancelled",
      };
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await Promise.all(
        order.items.map((item: OrderItem) =>
          tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                increment: item.quantity,
              },
            },
          })
        )
      );

      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELED" },
      });
    });

    revalidatePath("/orders");
    revalidatePath("/");

    return {
      success: true,
      message: "Order cancelled successfully",
      orderId: order.id,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to cancel order",
    };
  }
}

export async function getAllOrders() {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: {
          not: "CANCELED",
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            fullName: true,
          },
        },
      },
    });

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to fetch orders",
    };
  }
}

export async function markOrderAsDelivered(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    if (order.status === "PENDING") {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "COMPLETED" },
      });

      revalidatePath("/admin/orders");
      return {
        success: true,
        message: "Order marked as completed",
      };
    } else if (order.status === "COMPLETED") {
      return {
        success: false,
        message: "Order is already completed",
      };
    } else if (order.status === "CANCELED") {
      return {
        success: false,
        message: "Cannot update a canceled order",
      };
    }

    return {
      success: false,
      message: "Invalid order status",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update order status",
    };
  }
}
