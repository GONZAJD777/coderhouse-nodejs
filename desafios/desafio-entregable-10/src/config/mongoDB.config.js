import { MongoClient, ServerApiVersion } from 'mongodb'
import {CNX_STR} from "./config.js";

const uri = CNX_STR;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

await client.connect()

const db = client.db("ecommerce")

export const dbProducts = db.collection('products')
export const dbCarts = db.collection('carts')
export const dbUsers = db.collection('users')
export const dbMessages = db.collection('messages')
export const dbTickets = db.collection('tickets')
