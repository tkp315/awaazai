import asyncHandler from '@utils/asyncHandler.js';

// signup
// send otp
// verify otp
// login
// logout
// profile ->crud

const signup = asyncHandler(async (req, res) => {
  // steps
  /*
1.  
*/
  const { accountType, fullName, email, password } = req.body;
  // validation
});
