import bcrypt from "bcrypt";
import mongoose from "mongoose"; // Import only necessary modules from mongoose
import NextAuth from "next-auth";
import { getSession } from "next-auth/react"; // Import getSession from next-auth/react
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/libs/mongoConnect";
import { UserInfo } from "../../../../models/UserInfo";
import { User } from '@/models/User';

const adapter = new MongoDBAdapter(clientPromise); // Create MongoDBAdapter instance

export const authOptions = {
  secret: process.env.SECRET,
  adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      id: 'credentials',
      credentials: {
        username: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password", placeholder: "password" }
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Connect to MongoDB outside of the authorize function
        await mongoose.connect(process.env.MONGO_URL);

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return null;

        // Compare passwords
        const passwordOk = bcrypt.compareSync(password, user.password);
        if (!passwordOk) return null;

        return user;
      }
    })
  ],
}

export async function isAdmin(req) {
  const session = await getSession({ req }); // Get session using req
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return false;
  }
  const userInfo = await UserInfo.findOne({ email: userEmail });
  if (!userInfo) {
    return false;
  }
  return userInfo.admin;
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
