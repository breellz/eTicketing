import { main } from "./app";
import datasource, { disconnect } from "./database/postgres";
const start = async () => {
  const server = await main();

  const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;


  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  server.on("close", async () => {
    await disconnect(datasource)
  });
};

start();
