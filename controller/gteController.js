import nodemailer from "nodemailer";

const gte = async (req, res) => {
  try {
    res.json({ data: "GTE FUNCTION" });
  } catch (err) {
    res.json(err);
  }
};
export { gte };