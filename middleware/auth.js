import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json("Not authenticated!");

    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Assuming the user ID is included in the JWT payload as 'userId'
      req.userId = decodedData.userId;
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;
