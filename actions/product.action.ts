"use server";

import imageKit from "@/lib/config";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const getProducts = async () => {
  return await prisma.product.findMany();
};

export const createProduct = async (
  name: string,
  description: string,
  price: number,
  images: File[],
  category: string,
  stock: number,
  size?: string
) => {
  try {
    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const buffer = await Buffer.from(await image.arrayBuffer());
        const res = await imageKit.upload({
          file: buffer,
          fileName: image.name,
        });
        return res.url;
      })
    );

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        images: uploadedImages,
        category: category as any,
        stock,
        size,
      },
    });

    revalidatePath("/");

    return { success: true, product };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      redirect("/sign-in");
    }

    if (!productId || quantity <= 0) {
      return { success: false, message: "Invalid product or quantity" };
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, name: true, price: true, stock: true },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    if (product.stock < quantity) {
      return { success: false, message: "Insufficient stock" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: {
          where: { productId },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          items: {
            create: {
              productId,
              quantity,
            },
          },
        },
        include: {
          items: true,
        },
      });
    } else {
      const exsistingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (exsistingItem) {
        const newQuantity = exsistingItem.quantity + quantity;

        if (newQuantity > product.stock) {
          return { success: false, message: "Insufficient stock" };
        }

        await prisma.cartItem.update({
          where: { id: exsistingItem.id },
          data: { quantity: newQuantity },
        });

        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: {
              update: {
                where: { id: exsistingItem.id },
                data: { quantity: newQuantity },
              },
            },
          },
        });

        await prisma.product.update({
          where: { id: productId },
          data: { stock: product.stock - quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            productId,
            quantity,
            cartId: cart.id,
          },
        });

        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: {
              create: {
                productId,
                quantity,
              },
            },
          },
        });

        await prisma.product.update({
          where: { id: productId },
          data: { stock: product.stock - quantity },
        });
      }
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    revalidatePath("/cart");
    revalidatePath(`/products/${productId}`);

    return { success: true, cart: updatedCart };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
