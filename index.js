require('dotenv').config();
const express = require('express');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Webhook endpoint for receiving WhatsApp messages
app.post('/webhook', (req, res) => {
  try {
    const { Body, From } = req.body;
    console.log(`Received message from ${From}: ${Body}`);

    // Process the incoming message and send a response
    const responseMessage = `Thanks for your message! We'll get back to you soon.`;
    
    client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: From,
      body: responseMessage
    })
    .then(message => {
      console.log(`✅ Response sent with SID: ${message.sid}`);
      res.status(200).send('Message processed');
    })
    .catch(err => {
      console.error('❌ Error sending response:', err);
      res.status(500).send('Error processing message');
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Send initial WhatsApp message (keep this for testing)
client.messages
  .create({
    from: process.env.TWILIO_WHATSAPP_NUMBER,
    to: 'whatsapp:+254717854140',
    body: '👋 Hello from your WhatsApp bot built with Node.js! I can now receive messages too.',
  })
  .then(message => console.log(`✅ Message sent with SID: ${message.sid}`))
  .catch(err => console.error('❌ Error sending message:', err));
