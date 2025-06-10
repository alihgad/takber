import Joi from "joi";
import { Types } from "mongoose";

// Custom validate id rule
export let customId = (value, helper) => {
  let data = Types.ObjectId.isValid(value);
  return data ? value : helper.messages("Invalid ID!");
};

// Header validate rule

export const generalRules = {
  objectId: Joi.string().custom(customId),
  headers: Joi.object({
    token: Joi.string().required(),
    "postman-token": Joi.string().required(),
    "content-type": Joi.string().required(),
    "content-length": Joi.string().required(),
    host: Joi.string().required(),
    "user-agent": Joi.string().required(),
    accept: Joi.string().required(),
    "accept-encoding": Joi.string().required(),
    connection: Joi.string().required(),
    'cache-control': 'no-cache',
  }),
};
