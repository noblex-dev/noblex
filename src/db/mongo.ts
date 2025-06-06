import mongoose from "mongoose";

const dbConnect = async (root: string, db: any) => {
  if (!db.host || !db.port || !db.name) {
    console.error("Missing required environment variables for DB connection");
    process.exit(1);
  }

  const db_user_exists = Boolean(db.user && db.pass);
  const db_user = db_user_exists ? `${db.user}:${db.pass}@` : "";
  const db_host = `${db.host}:${db.port}/${db.name}`;

  const queryParams: string[] = [];

  if (db_user) {
    queryParams.push("authSource=admin");
  }

  const db_query = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  const DB_URI = `mongodb://${db_user}${db_host}${db_query}`;
  // console.log(DB_URI);
  mongoose.set("toJSON", { versionKey: false });
  mongoose.set("strictQuery", true);

  await mongoose.connect(DB_URI);

  // const walletSchema = new mongoose.Schema({ name: String });
  // const Wallet = mongoose.model("Wallet", walletSchema);
  // const wallets = await Wallet.find();
  //console.log(wallets);
};

export default dbConnect;
