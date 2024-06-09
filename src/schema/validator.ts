import Ajv, { ErrorObject } from 'ajv';
import { ITEMS } from '../constants';

// schema
const schema = {
  type: 'object',
  properties: {
    itemId: { type: 'string' },
    itemType: { type: 'string', enum: ITEMS },
  },
  required: ['itemId', 'itemType'],
  additionalProperties: false,
};

// Create the Ajv instance and compile the schema
const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

export const validatePayload = (payload: any): ErrorObject[] => {
  const isValid = validate(payload);
  return isValid ? [] : (validate.errors as ErrorObject[]);
};
