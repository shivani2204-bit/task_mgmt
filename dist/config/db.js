import * as Index from "../index.js";
Index.dotenv.config();
(async function () {
  try {
    await Index.mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log("Database error", error);
  }
})();