export default {
  dbURL:
    process.env.MONGO_URL ||
    "mongodb+srv://tomer:giLQyBuiD70Qodz8@cluster0-klgzh.mongodb.net/test?retryWrites=true&w=majority",
  dbName: process.env.DB_NAME || "tester_db",
};
