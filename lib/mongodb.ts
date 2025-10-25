// lib/mongodb.ts
import { MongoClient } from 'mongodb'

// Periksa apakah MONGODB_URI ada di .env.local
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
let client: MongoClient
let clientPromise: Promise<MongoClient>

// Kita perlu mendeklarasikan variabel global di TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient>
}

if (process.env.NODE_ENV === 'development') {
  // Dalam mode development, kita gunakan variabel global
  // Ini agar koneksi tidak dibuat ulang setiap kali ada 'hot reload'
  // (perubahan kode saat server jalan)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // Dalam mode production, lebih sederhana.
  client = new MongoClient(uri)
  clientPromise = client.connect()
}

// Ekspor promise koneksi.
// Di file API Anda (route.ts), Anda akan 'await' promise ini.
export default clientPromise