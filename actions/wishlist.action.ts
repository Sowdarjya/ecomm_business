"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const addToWishlist = async (productId: string) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
      return { success: false, message: "Authentication required" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    let wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId: user.id },
      });
    }

    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId: product.id,
        },
      },
    });

    if (existingItem) {
      return { success: false, message: "Product already in wishlist" };
    }

    await prisma.wishlistItem.create({
      data: {
        wishlistId: wishlist.id,
        productId: product.id,
      },
    });

    return { success: true, message: "Added to wishlist" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to add to wishlist" };
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      redirect("/sign-in");
      return { success: false, message: "Authentication required" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return { success: false, message: "User not found" };

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
    });

    if (!wishlist) return { success: false, message: "Wishlist not found" };

    await prisma.wishlistItem.delete({
      where: {
        wishlistId_productId: {
          wishlistId: wishlist.id,
          productId,
        },
      },
    });

    return { success: true, message: "Removed from wishlist" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to remove from wishlist" };
  }
};

export const getWishlist = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      redirect("/sign-in");
      return { success: false, message: "Authentication required" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) return { success: false, message: "User not found" };

    const wishlist = await prisma.wishlist.findUnique({
      where: { userId: user.id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!wishlist) {
      return { success: true, items: [] };
    }

    const items = wishlist.products.map((p: any) => p.product);

    return { success: true, items };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to fetch wishlist" };
  }
};
