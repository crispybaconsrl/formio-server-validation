const Validator = require('formio/src/resources/Validator');
const hook = require('formio/src/util/hook')({});

const _Validator = Validator;

const submissionModel = function(doc, field, skipId) {};

/**
 * Validates the given data against the provided schema.
 *
 * @param {Object} schema - The JSON schema to validate the data against.
 * @param {Object} data - The data to be validated.
 * @return {Promise<Object>} - A promise that resolves with the validated submission, or rejects with an error object.
 * @throws {Object} - An error object containing a `system` property for system errors or a `validation` property for validation errors.
 */
async function validate(schema, data) {
  const validator = new _Validator(schema, submissionModel, {}, {}, hook);
  const body = {data, metadata: {}};

  const handler = (body) => new Promise((resolve, reject) => {
    return validator.validate(body, (error, submission) => {
      if (error) {
        return reject(error);
      }

      return resolve(submission);
    });
  });

  try {
    const submission = await handler(body);
    return submission;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  validate,
};
