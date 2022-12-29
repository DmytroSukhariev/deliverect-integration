import express from 'express';
import { Deliverect } from '@clients/deliverect';
import { DatabaseTokenRepo } from '@clients/deliverect/token-repo';
import { CONFIG } from '@config';

const app = express();

const deliverectClient = new Deliverect(new DatabaseTokenRepo());

app.get('/accounts', async (req, res) => {
  const { status, body } = await deliverectClient.accounts();
  res.statusCode = status;
  res.json(body).send();
});

app.listen(CONFIG.APP.PORT, () => {
  console.log(`MAIN SERVER STARTED ON http://localhost:${CONFIG.APP.PORT}`)
});