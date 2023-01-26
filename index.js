const {validate} = require('./validator');

const fastify = require('fastify')({
  logger: true,
});

const validationRequestSchema = {
  schema: {
    body: {
      type: 'object',
      required: ['schema', 'data'],
      properties: {
        'schema': {
          type: 'object',
        },
        'data': {
          type: 'object',
        },
      },
    },
  },
};
fastify.post('/', validationRequestSchema, async (request, response) => {
  try {
    const {schema, data} = request.body;

    if (!schema || !data) {
      return response.status(400).send('Missing schema and/or form data');
    }

    const submission = await validate(schema, data);

    return response.send(submission);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(409).send(error);
    }

    request.log.error(error);
    return response.status(500).send(error);
  }
});

fastify.listen({port: 3000}, function(err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  console.log(`Server is now listening on ${address}`);
});
