import { asyncHandler } from "../utils/ErrorHandling.js";

const validation = (schema) => {
    
    return asyncHandler(

        async (req, res, next) => {
                
                
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