import { asyncHandler } from "../utils/ErrorHandling.js";

const validation = (schema) => {

    return asyncHandler(
        
        async (req, res, next) => {

            
            if (req.body.title && typeof req.body.title === 'string') {
                req.body.title = JSON.parse(req.body.title)
            }
            if (req.body.description && typeof req.body.description === 'string') {
                req.body.description = JSON.parse(req.body.description)
            }

            
            for (const key in schema) {

                const { error } = schema[key].validate(req[key], { abortEarly: false });
                if (error) {
                    const message = error.details.map(detail => detail.message);
                    next(new Error(message, { cause: 400 }));

                }
            }

            next();
        }
    );
};
export default validation