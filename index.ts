import { PrismaClient } from '@prisma/client';
import express from 'express';

const app = express();
const prisma = new PrismaClient();

app.get("/", (req, res) => {
  res.send("Hello World!");
})

async function main() {
  // ... you will write your Prisma Client queries here
  const allUsers = await prisma.usuario.findMany()
  console.log(allUsers)
}

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`App listening on port: ${port}`))