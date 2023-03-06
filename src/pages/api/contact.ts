import type { NextApiRequest, NextApiResponse } from "next"
import { MongoClient } from "mongodb"

type Data = {
  message: string
  newMessage?: NewMessage
}

type NewMessage = {
  email: string
  name: string
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { name, email, message } = req.body
    if (
      !email ||
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !message ||
      message.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input" })
      return
    }

    const newMessage: NewMessage = {
      email,
      name,
      message,
    }

    let client

    const connectionString = `mongodb+srv://${process.env.mongodb_username}:${process.env.mongodb_password}@${process.env.mongodb_cluster}.czfaeto.mongodb.net/${process.env.mongodb_database}?retryWrites=true&w=majority`

    try {
      client = await MongoClient.connect(connectionString)
    } catch (error) {
      res.status(500).json({ message: "Could not connect to database" })
      return
    }

    try {
      const db = client.db()
      await db.collection("messages").insertOne(newMessage)
    } catch (error) {
      client.close()
      res.status(500).json({ message: "Storing message failed" })
      return
    }

    client.close()

    res
      .status(201)
      .json({ message: "Successfully stored message!", newMessage: newMessage })
  }
}
