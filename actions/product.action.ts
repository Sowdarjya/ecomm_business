"use server";

import imageKit from "@/lib/config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
