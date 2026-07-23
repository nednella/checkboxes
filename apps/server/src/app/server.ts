import express from "express";

const app = express();
app.disable("x-powered-by");
app.disable("etag");

export default app;
