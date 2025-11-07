import jwt from "jsonwebtoken";

const SECRET = process.env.QR_SECRET || "supersecure_qr_secret";

export const generateQRToken = (payload: object, expiresIn: string = "5m") => {
  return jwt.sign(payload, SECRET, { expiresIn });
};

export const verifyQRToken = (token: string) => {
  return jwt.verify(token, SECRET);
};
