import { Hono } from "hono";
import messagesRoutes from "./routes/messages";
import { serve } from "@hono/node-server";

const app = new Hono();

app.route("/messages", messagesRoutes);

serve({ port: 3000, fetch: app.fetch });
