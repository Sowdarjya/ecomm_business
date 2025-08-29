"use server";

import imageKit from "@/lib/config";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type Category = "CLOTHING" | "ACCESSORIES";

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  size?: string; // optional
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: "CLOTHING" | "ACCESSORIES";
    size: string[];
    stock: number;
  };
}

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
  sizes: string[] = []
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
        size: sizes,
      },
    });

    revalidatePath("/");

    return { success: true, product };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
};

export const addToCart = async (
  productId: string,
  quantity: number = 1,
  size?: string
) => {
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
                data: { quantity: newQuantity, size },
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
            size,
          },
        });

        await prisma.cart.update({
          where: { id: cart.id },
          data: {
            items: {
              create: {
                productId,
                quantity,
                size,
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

export const getProductsByCategory = async (category: string) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: category as Category,
      },
    });

    return products;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getProductDetails = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    return { success: true, product };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch product details" };
  }
};

export const getCartQuantity = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return { success: true, quantity: 0 };
    }

    const quantity = cart.items
      .map((item: { quantity: number }) => item.quantity)
      .reduce((a: number, b: number) => a + b, 0);

    revalidatePath("/cart");
    revalidatePath("/");
    return { success: true, quantity };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch cart quantity" };
  }
};

export const getUserCartItems = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    if (!user) {
      return { success: false, message: "User not found" };
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

    if (!cart) {
      return { success: true, items: [] };
    }
    revalidatePath("/cart");
    revalidatePath("/");
    return { success: true, items: cart.items };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to fetch cart items" };
  }
};

export const removeCartItem = async (cartItemId: string) => {
  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      select: { id: true, productId: true, quantity: true },
    });

    if (!cartItem) {
      return { success: false, message: "Cart item not found" };
    }

    const product = await prisma.product.findUnique({
      where: { id: cartItem.productId },
      select: { id: true, stock: true },
    });

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { stock: product.stock + cartItem.quantity },
    });

    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    revalidatePath("/cart");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Failed to remove cart item" };
  }
};

type UpdateProductData = {
  name: string;
  description: string;
  price: number;
  category: "CLOTHING" | "ACCESSORIES";
  stock: number;
  size: string[];
};

export async function updateProduct(
  productId: string,
  data: UpdateProductData
) {
  try {
    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Validate input data
    if (!data.name.trim()) {
      return {
        success: false,
        message: "Product name is required",
      };
    }

    if (data.price <= 0) {
      return {
        success: false,
        message: "Price must be greater than 0",
      };
    }

    if (data.stock < 0) {
      return {
        success: false,
        message: "Stock cannot be negative",
      };
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        category: data.category,
        stock: data.stock,
        size: {
          set: data.size.length > 0 ? data.size : [],
        },
        updatedAt: new Date(),
      },
    });

    // Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);
    revalidatePath("/");

    return {
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    };
  } catch (error) {
    console.error("Error updating product:", error);
    return {
      success: false,
      message: "Failed to update product",
    };
  }
}

// Additional helper function to get a single product by ID (if needed)
export async function getProductById(productId: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    return {
      success: true,
      product,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      success: false,
      message: "Failed to fetch product",
    };
  }
}

// Function to delete a product (bonus functionality)
export async function deleteProduct(productId: string) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    // Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath("/");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting product:", error);
    return {
      success: false,
      message: "Failed to delete product",
    };
  }
}
