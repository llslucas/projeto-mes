import { SellOrderRepository } from "@/domain/mes/application/repositories/sell-order-repository";
import { SellOrder } from "@/domain/mes/enterprise/entities/sell-order";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaSellOrderMapper } from "../mappers/prisma-sell-order-mapper";

@Injectable()
export class PrismaSellOrderRepository implements SellOrderRepository {
  constructor(private prismaService: PrismaService) {}

  async findById(sellOrderId: string): Promise<SellOrder | null> {
    const sellOrder = await this.prismaService.sellOrder.findUnique({
      where: { id: sellOrderId },
    });

    return sellOrder ? PrismaSellOrderMapper.toDomain(sellOrder) : null;
  }

  async create(sellOrder: SellOrder): Promise<void> {
    const data = PrismaSellOrderMapper.toPrisma(sellOrder);

    await this.prismaService.sellOrder.create({
      data,
    });
  }
}
