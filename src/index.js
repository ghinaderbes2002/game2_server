import fastify from "fastify";
import formbody from "@fastify/formbody";
import cors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import dotenv from "dotenv";
import usersRoute from "./routes/auth/auth_routes.js";
import roundRoute from "./routes/rounds_routes.js";
import logRoute from "./routes/log_routes.js";

const app = fastify();
dotenv.config();

app.register(cors, {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
});
app.register(fastifyHelmet, {
  crossOriginResourcePolicy: { policy: "cross-origin" },
});
app.register(formbody);
app.register(usersRoute);
app.register(roundRoute);
app.register(logRoute);

app.listen({ port: process.env.PORT, host: "0.0.0.0" }, () =>
  console.log("Server port " + process.env.PORT)
);
