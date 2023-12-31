import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PUT(req: Request, { params }: { params: { orderId: string } }) {
  try {
    const { orderId } = params;
    const { isPaid } = await req.json();

    const order = await prismadb.order.findFirst({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
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
    console.error("Error updating order:", error);
    return new NextResponse("Something went wrong.", { status: 500 });
  }
}
