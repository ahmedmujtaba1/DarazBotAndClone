const dialogflow = require("@google-cloud/dialogflow");
const { WebhookClient, Suggestion } = require("dialogflow-fulfillment");
const express = require("express");
const cors = require("cors");

const accountSid = "AC3326b911b891328a9d5931772d2d82e4";
const authToken = "063343ae8ee35871155d90fc2d293051";
const client = require("twilio")(accountSid, authToken);
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, I am Daraz Bot.....");
});

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add("Hi this is Server Message")
    }
  
  function orders(agent) {
    const { full_name, phone_number, address, product_name, product_price } =
      agent.parameters;
    console.log("intent  => orders");
    const total_cost = product_price + 50
    const message = `Your order is being confirmed. We have sent you a message regarding this. Your order detials : Product Name : ${product_name}, Product Price : ${product_price}, Your Name : ${full_name}, Phone Number : ${phone_number}, Address : ${address}, Total Cost : ${total_cost} (Delivery Charges : PKR 50)`
    agent.add(message);
    client.messages.create({
        body: `Your order is being confirmed. We have sent you a message regarding this.
        Your order detials : Product Name : ${product_name}, Product Price : ${product_price}, Your Name : ${full_name}, Phone Number : ${phone_number}, Address : ${address}, Total Cost : ${
          product_name + 50
        } (Delivery Charges : PKR 50)
        `,
        from: "+12512654420",
        to: `${phone_number}`,
      })
      .then((message) => console.log(message.sid))
      .done();
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", hi);
  // intentMap.set("orders", orders);
  agent.handleRequest(intentMap);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
