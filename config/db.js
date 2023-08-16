const { PrismaClient } = require("@prisma/client");

let prisma;

if (!global.cachedPrisma) {
	global.cachedPrisma = new PrismaClient();
}

prisma = global.cachedPrisma;

const db = prisma;
module.exports = db;
