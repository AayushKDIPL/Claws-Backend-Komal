import { verifyToken } from "../utils/jwt.js";

export const isAuthorised = async (req, res, next) => {
  try {
    if (!req.headers["authorization"])
      return res.status(401).json({ message: "Unauthorised" });

    const JWT = req.headers["authorization"].replaceAll("JWT ", "");
    

    // const tokenDetails = await verifyToken(
    //   JWT,
    //   process.env.ACCESS_TOKEN_SECRET
    // );

    // if (!tokenDetails) return res.status(401).json({ message: "Uised" });
    // req.authUser = tokenDetails;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};