import fs from "fs";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const timeSuffix = (n) => {
  return [, "st", "nd", "rd"][(n / 10) % 10 ^ 1 && n % 10] || "th";
};

export const sendSignUpEmail = async (
  email,
  serviceDate,
  seats,
  updaterPin
) => {
  const date = new Date(serviceDate);
  const msg = {
    to: email,
    from: "Wildwood Christmas <mailer@wildwoodchristmas.com>",
    subject: "Wildwood Christmas Eve Services",
    attachments: [
      {
        filename: "logo",
        type: "image/png",
        content_id: "logo",
        content: fs.readFileSync("./assets/images/banner.png", {
          encoding: "base64",
        }),
        disposition: "inline",
      },
    ],
    html: `
    <head>
      <style>
          .body {
              text-align: center;
              background: #2f3847;
              font: Roboto;
              border-radius: 20px;
              padding-top: 20px;
              padding-bottom: 20px;
          }
          p {
              color: #ffffff;
              font-size: 20px;
              margin: 0px;
              padding: 0px;
              font-weight: 300;
          }
          .logo {
              width: 60%;
              max-width: 300px;
              padding-bottom: 15px;
          }
          .text {
            margin-left: 5px;
            margin-right: 5px;
          }
          @media only screen and (max-width: 600px) {
            p {
                font-size: 15px;
            }
          }
      </style>
  </head>
  <body class="body">
      <img class="logo" src="cid:logo" alt="image" />
      <div class="text">
        <p>Thank you for reserving your spot for Wildwood's Christmas Eve Services!</p>
        <br />
        <p>You reserved ${seats} ${
      seats == 1 ? "seat" : "seats"
    } for our ${date.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      day: "numeric",
      month: "long",
    })}${timeSuffix(
      date.toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
        day: "numeric",
      })
    )}, ${date.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    })} service.</p>
      <br />
      <p>Your Updater Pin: <span style="color:#9c5e3c;font-weight:bold;">${updaterPin}</span></p>
      <p style="font-size:16px;">Use this pin number to update or remove your current selection</p>
    </div>
  </body>`,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log("Mailer failed!");
  }
};

export const sendUpdaterPin = async (email, updaterPin) => {
  const msg = {
    to: email,
    from: "Wildwood Christmas <mailer@wildwoodchristmas.com>",
    subject: "Wildwood Christmas Eve Services Updater Pin",
    html: `
    <head>
      <style>
      .body {
        text-align: center;
        background: #2f3847;
        font: Roboto;
        border-radius: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    p {
        color: #ffffff;
        font-size: 20px;
        margin: 0px;
        padding: 0px;
        font-weight: 300;
    }
    .logo {
        width: 60%;
        max-width: 300px;
        padding-bottom: 15px;
    }
    .text {
      margin-left: 5px;
      margin-right: 5px;
    }
    @media only screen and (max-width: 600px) {
      p {
          font-size: 15px;
      }
    }
      </style>
  </head>
  <body class="body">
    <div class="text">
      <p>Your Updater Pin: <span style="color:#9c5e3c;font-weight:bold;">${updaterPin}</span></p>
    </div>
  </body>`,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log("Mailer failed!");
  }
};

export const sendUpdateEmail = async (
  email,
  serviceDate,
  seats,
  updaterPin
) => {
  const date = new Date(serviceDate);
  const msg = {
    to: email,
    from: "Wildwood Christmas <mailer@wildwoodchristmas.com>",
    subject: "Wildwood Christmas Eve Updated Services",
    attachments: [
      {
        filename: "logo",
        type: "image/png",
        content_id: "logo",
        content: fs.readFileSync("./assets/images/banner.png", {
          encoding: "base64",
        }),
        disposition: "inline",
      },
    ],
    html: `
    <head>
      <style>
      .body {
        text-align: center;
        background: #2f3847;
        font: Roboto;
        border-radius: 20px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    p {
        color: #ffffff;
        font-size: 20px;
        margin: 0px;
        padding: 0px;
        font-weight: 300;
    }
    .logo {
        width: 60%;
        max-width: 300px;
        padding-bottom: 15px;
    }
    .text {
      margin-left: 5px;
      margin-right: 5px;
    }
    @media only screen and (max-width: 600px) {
      p {
          font-size: 15px;
      }
    }
      </style>
  </head>
  <body class="body">
      <img class="logo" src="cid:logo" alt="image" />
      <div class="text">
        <p>Thank you for updating your spot for Wildwood's Christmas Eve Services!</p>
        <br />
        <p>You reserved ${seats} ${
      seats == 1 ? "seat" : "seats"
    } for our ${date.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      day: "numeric",
      month: "long",
    })}${timeSuffix(
      date.toLocaleDateString("en-US", {
        timeZone: "America/Los_Angeles",
        day: "numeric",
      })
    )}, ${date.toLocaleDateString("en-US", {
      timeZone: "America/Los_Angeles",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    })} service.</p>
        <br />
        <p>Your Updater Pin: <span style="color:#9c5e3c;font-weight:bold;">${updaterPin}</span></p>
      </div>
  </body>`,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log("Mailer failed!");
  }
};
