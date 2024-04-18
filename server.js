import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

import { getSlippiData } from "./fetcher.js";

fastify.route({
  method: "GET",
  url: "/slp-rank",
  schema: {
    querystring: {
      type: "object",
      properties: {
        code: { type: "string" },
      },
      required: ["code"],
    },
  },
  preHandler: async (request, reply) => {
    if (!request.query.code) {
      reply.code(400).send({ error: "Pass in connect code" });
    }
  },
  handler: async (request, reply) => {
    const data = await getSlippiData(request.query.code);
    return data;
  },
});

try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
