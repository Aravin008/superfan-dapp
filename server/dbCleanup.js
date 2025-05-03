require('dotenv').config({ path: './server/.env' });
const { MongoClient } = require("mongodb");

const cleanUpCollections = ['messages', 'users'];

async function dropAllCollections() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("superfan");

    const collections = await db.collections();

    // console.log("collections", collections);

    for (const collection of collections) {
      if(cleanUpCollections.includes(collection.collectionName)) {
        console.log(`Dropping collection: ${collection.collectionName}`);
        await db.dropCollection(collection.collectionName);
      }
    }

    console.log("✅ All selected collections dropped.");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

dropAllCollections();
