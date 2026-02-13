import { MongoClient } from "mongodb";

// Docker container URI
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = "ironcircle";

async function seed() {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(DB_NAME);
    const usersCollection = db.collection("users");


    await usersCollection.deleteMany({});

    // Seed me
    const user = {
      name: "Diego",
      username: "diego123",
      type: "admin",
      password: "password123",
      created: new Date().toISOString(),
    };

    const result = await usersCollection.insertOne(user);
    console.log(`Inserted user with _id: ${result.insertedId}`);
  } catch (err) {
    console.error("Error seeding MongoDB:", err);
  } finally {
    await client.close();
    console.log("Disconnected from MongoDB");
  }
}

seed();
