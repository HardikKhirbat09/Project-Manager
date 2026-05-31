import {apiResponse} from './../utils/apiResponse.js';
import {asyncHandler} from '../utils/async-handler.js';

// const healthCheck = async (req, res, next) => {
//     try{
//         const user = await getUserFromDb();
//         res.status(200).json(new apiResponse(200, null, 'Server is running fine'));
//     }
//     catch(error){
//         next(error);
//     }
// }

const healthCheck = asyncHandler(async (req, res) => {
    // const user = await getUserFromDb();
    res.status(200).json(new apiResponse(200, null, 'Server is running fine'));
});
export { healthCheck };