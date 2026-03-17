import { getPrisma } from '@lib/services/database/prisma/index.js';
import type {
  CreateCapabilityInput,
  UpdateCapabilityInput,
  CreateCapabilityFunctionInput,
  UpdateCapabilityFunctionInput,
  CreateAvailableBotInput,
  UpdateAvailableBotInput,
} from '../validators/bot.validation.js';

export const adminBotService = {
  // ==========================================
  // CAPABILITY
  // ==========================================

  createCapability: async (data: CreateCapabilityInput) => {
    const prisma = getPrisma();
    return await prisma.capability.create({
      data: {
        name: data.name,
        description: data.description,
        availableBotId: data.availableBotId,
      },
      include: { functions: true },
    });
  },

  getAllCapabilities: async () => {
    const prisma = getPrisma();
    return await prisma.capability.findMany({
      include: { functions: true },
      orderBy: { createdAt: 'asc' },
    });
  },

  getCapabilityById: async (capabilityId: string) => {
    const prisma = getPrisma();
    return await prisma.capability.findUnique({
      where: { id: capabilityId },
      include: { functions: true },
    });
  },

  updateCapability: async (capabilityId: string, data: UpdateCapabilityInput) => {
    const prisma = getPrisma();
    return await prisma.capability.update({
      where: { id: capabilityId },
      data,
      include: { functions: true },
    });
  },

  deleteCapability: async (capabilityId: string) => {
    const prisma = getPrisma();
    return await prisma.capability.delete({
      where: { id: capabilityId },
    });
  },

  // ==========================================
  // CAPABILITY FUNCTION
  // ==========================================

  createCapabilityFunction: async (capabilityId: string, data: CreateCapabilityFunctionInput) => {
    const prisma = getPrisma();
    return await prisma.capabilityFunction.create({
      data: {
        name: data.name,
        description: data.description,
        capabilityId,
      },
    });
  },

  getCapabilityFunctions: async (capabilityId: string) => {
    const prisma = getPrisma();
    return await prisma.capabilityFunction.findMany({
      where: { capabilityId },
      orderBy: { createdAt: 'asc' },
    });
  },

  getCapabilityFunctionById: async (functionId: string) => {
    const prisma = getPrisma();
    return await prisma.capabilityFunction.findUnique({
      where: { id: functionId },
    });
  },

  updateCapabilityFunction: async (functionId: string, data: UpdateCapabilityFunctionInput) => {
    const prisma = getPrisma();
    return await prisma.capabilityFunction.update({
      where: { id: functionId },
      data,
    });
  },

  deleteCapabilityFunction: async (functionId: string) => {
    const prisma = getPrisma();
    return await prisma.capabilityFunction.delete({
      where: { id: functionId },
    });
  },

  // ==========================================
  // AVAILABLE BOT
  // ==========================================

  createAvailableBot: async (data: CreateAvailableBotInput) => {
    const prisma = getPrisma();
    return await prisma.availableBot.create({
      data: {
        name: data.name,
        description: data.description,
        icon: data.icon,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
        // Connect capabilities via implicit M2M
        ...(data.capabilityIds && data.capabilityIds.length > 0
          ? {
              capabilities: {
                connect: data.capabilityIds.map(id => ({ id })),
              },
            }
          : {}),
      },
      include: {
        capabilities: { include: { functions: true } },
      },
    });
  },

  // Admin sees all (active + inactive)
  getAllAvailableBots: async () => {
    const prisma = getPrisma();
    return await prisma.availableBot.findMany({
      include: {
        capabilities: { include: { functions: true } },
        _count: { select: { bots: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  },

  getAvailableBotById: async (availableBotId: string) => {
    const prisma = getPrisma();
    return await prisma.availableBot.findUnique({
      where: { id: availableBotId },
      include: {
        capabilities: { include: { functions: true } },
        _count: { select: { bots: true } },
      },
    });
  },

  updateAvailableBot: async (availableBotId: string, data: UpdateAvailableBotInput) => {
    const prisma = getPrisma();
    return await prisma.availableBot.update({
      where: { id: availableBotId },
      data,
      include: {
        capabilities: { include: { functions: true } },
      },
    });
  },

  // Replace all capabilities with new set (sync)
  syncAvailableBotCapabilities: async (availableBotId: string, capabilityIds: string[]) => {
    const prisma = getPrisma();
    return await prisma.availableBot.update({
      where: { id: availableBotId },
      data: {
        capabilities: {
          set: capabilityIds.map(id => ({ id })), // set = disconnect old, connect new
        },
      },
      include: {
        capabilities: { include: { functions: true } },
      },
    });
  },

  toggleAvailableBot: async (availableBotId: string, isActive: boolean) => {
    const prisma = getPrisma();
    return await prisma.availableBot.update({
      where: { id: availableBotId },
      data: { isActive },
    });
  },

  deleteAvailableBot: async (availableBotId: string) => {
    const prisma = getPrisma();
    return await prisma.availableBot.delete({
      where: { id: availableBotId },
    });
  },

  // ==========================================
  // HELPERS
  // ==========================================

  // Check all capabilityIds exist in DB
  validateCapabilityIds: async (capabilityIds: string[]): Promise<boolean> => {
    const prisma = getPrisma();
    const found = await prisma.capability.findMany({
      where: { id: { in: capabilityIds } },
      select: { id: true },
    });
    return found.length === capabilityIds.length;
  },

  // Count user bots using this template
  getBotCountByAvailableBot: async (availableBotId: string): Promise<number> => {
    const prisma = getPrisma();
    return await prisma.bot.count({
      where: { availableBotId },
    });
  },
};
