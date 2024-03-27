import nodemailer from "nodemailer";

const sayHello = async (req, res) => {
  try {
    res.json({ data: "Hello" });
  } catch (err) {
    res.json(err);
  }
};
export { sayHello };
