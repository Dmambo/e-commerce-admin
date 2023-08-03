
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export async function PUT(req: Request, { params }: { params: { orderId: string, storeId: string } }) {
  try {
    const { userId } = auth();
    const { orderId } = params;
    const { isPaid } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const order = await prismadb.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 405 });
    }

    const updatedOrder = await prismadb.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid,
      },
    });

    return new NextResponse(JSON.stringify(updatedOrder), { status: 200 });
  } catch (error) {
    console.log('[ORDER_PUT]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

