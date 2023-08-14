const { PrismaClient } = require("@prisma/client");
require("server-only");

if (!global.cachedPrisma) {
	global.cachedPrisma = new PrismaClient();
}

const prisma = global.cachedPrisma;

module.exports.db = prisma;
