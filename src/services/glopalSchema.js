import joi from "joi";
import { ObjectId } from 'mongodb'
const objectIdValidator = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid MongoDB ObjectId');
  }
  return value;  // Everything is OK
};

export default {
  password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ , "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."),
  email: joi.string().email(),
  headers: joi.object({
    connection: joi.string(),
    "cache-control": joi.string(),
    "x-vercel-internal-ingress-bucket": joi.string(),
    'x-vercel-proxied-for': joi.string(),
    'x-vercel-ip-timezone': joi.string(),
    'x-forwarded-for': joi.string(),
    'x-vercel-id': joi.string(),
    'postman-token': joi.string(),
    'user-agent': joi.string(),
    'x-vercel-forwarded-for': joi.string(),
    'x-vercel-ip-longitude': joi.string(),
    'x-vercel-ip-as-number': joi.string(),
    'x-vercel-ip-continent': joi.string(),
    accept: joi.string(),
    host: joi.string(),
    'x-vercel-proxy-signature': joi.string(),
    'content-type': joi.string(),
    'x-vercel-ip-country': joi.string(),
    'x-vercel-ip-latitude': joi.string(),
    forwarded: joi.string(),
    'x-forwarded-host': joi.string(),
    'accept-encoding': joi.string(),
    'x-forwarded-proto': joi.string(),
    'x-vercel-proxy-signature-ts': joi.string(),
    'x-vercel-ja4-digest': joi.string(),
    'x-real-ip': joi.string(),
    'x-vercel-ip-country-region': joi.string(),
    'x-vercel-ip-city': joi.string(),
    'x-vercel-deployment-url': joi.string(),
    'content-length': joi.string(),
    referer: joi.string(),
    connection: joi.string(),
    authorization : joi.string().required()

  }).required(),
  file: joi.object({
    fieldname: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    filename: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().required()
  }),
  id: joi.string().custom(objectIdValidator, 'ObjectId validation')
}




