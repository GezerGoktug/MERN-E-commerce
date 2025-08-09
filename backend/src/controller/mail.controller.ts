
import path from "path";
import fs from "fs";
import ejs from "ejs";
import juice from "juice";
import nodemailer from "nodemailer";

export const sendOrderMail = async (
  order: any,
  toEmail: any,
  payment: boolean
) => {
  const { delivery_info, products, totalPrice } = order;

  const publicMailPath = path.resolve(process.cwd(), "public", "mail");

  const templatePath = path.join(
    publicMailPath,
    "payment",
    "template.ejs"
  );
  const cssPath = path.join(publicMailPath, "payment", "style.css");

  const ejsTemplate = fs.readFileSync(templatePath, "utf8");
  const css = fs.readFileSync(cssPath, "utf8");

  const renderedHtml = ejs.render(ejsTemplate, {
    name: delivery_info.firstName + " " + delivery_info.lastName,
    products: products,
    totalPrice: totalPrice,
    deliveryInfos: delivery_info,
    payment,
  });

  const htmlWithInlineCss = juice.inlineContent(renderedHtml, css);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Forever E-commerce" <${process.env.EMAIL}>`,
    to: toEmail,
    subject: "Payment Successfully",
    html: htmlWithInlineCss,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(publicMailPath, "payment", "png", "logo.png"),
        cid: "logo",
      },
      {
        filename: "success-icon.png",
        path: path.join(
          publicMailPath,
          "payment",
          "png",
          "success-icon.png"
        ),
        cid: "success-icon",
      },
      {
        filename: "delivery-icon.png",
        path: path.join(
          publicMailPath,
          "payment",
          "png",
          "delivery-icon.png"
        ),
        cid: "delivery-icon",
      },
      {
        filename: "instagram-icon.png",
        path: path.join(
          publicMailPath,
          "payment",
          "png",
          "instagram-icon.png"
        ),
        cid: "instagram-icon",
      },
      {
        filename: "shopping-bag-icon.png",
        path: path.join(
          publicMailPath,
          "payment",
          "png",
          "shopping-bag-icon.png"
        ),
        cid: "shopping-bag-icon",
      },
      {
        filename: "x-icon.png",
        path: path.join(
          publicMailPath,
          "payment",
          "png",
          "x-icon.png"
        ),
        cid: "x-icon",
      },
    ],
  });
};

export const sendResetPasswordCodeEmail = async (
  toEmail: string,
  resetCode: string
) => {
  const publicMailPath = path.resolve(process.cwd(), "public", "mail");

  const ejsPath = path.join(
    publicMailPath,
    "reset-password",
    "template.ejs"
  );

  const cssPath = path.join(
    publicMailPath,
    "reset-password",
    "style.css"
  );

  const ejsTemplate = fs.readFileSync(ejsPath, "utf8");
  const css = fs.readFileSync(cssPath, "utf8");

  const ejsHtmlContent = ejs.render(ejsTemplate, {
    resetCode,
  });

  const html = juice.inlineContent(ejsHtmlContent, css);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Forever E-commerce" <${process.env.EMAIL}>`,
    to: toEmail,
    subject: "Reset Password",
    html,
    attachments: [
      {
        filename: "logo.png",
        path: path.join(
          publicMailPath,
          "reset-password",
          "png",
          "logo.png"
        ),
        cid: "logo",
      },
    ],
  });
};
