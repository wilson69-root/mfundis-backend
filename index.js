const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log(req.body); // You can process WhatsApp messages here
  res.send('Received');
});

app.get('/', (req, res) => {
  res.send("Fundis API is working");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
