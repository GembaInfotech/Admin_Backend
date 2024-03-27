import nodemailer from "nodemailer";

const stateAdmin = async (req, res) => {
  try {
    res.json({ data: "state Admin" });
  } catch (err) {
    res.json(err);
  }
};
export { stateAdmin };