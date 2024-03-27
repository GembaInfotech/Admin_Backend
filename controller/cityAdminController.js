import nodemailer from "nodemailer";

const cityAdmin = async (req, res) => {
  try {
    res.json({ data: "city Admin" });
  } catch (err) {
    res.json(err);
  }
};
export { cityAdmin };