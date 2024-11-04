export default {
  dbURL:
    process.env.MONGO_URL ||
    "mongodb+srv://tomer:P1ttaMj02hrzGLbO@cluster0.p8mfd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  dbName: process.env.DB_NAME || "BUG_DB",
};
