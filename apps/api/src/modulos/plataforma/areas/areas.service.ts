import { Injectable } from '@nestjs/common';
import type { AreaDto } from '@circadiano/contracts';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AreasService {
  constructor(private readonly prisma: PrismaService) {}

  listar(): Promise<AreaDto[]> {
    return this.prisma.area.findMany({
      select: { id: true, nombre: true },
      orderBy: { nombre: 'asc' },
    });
  }
}
