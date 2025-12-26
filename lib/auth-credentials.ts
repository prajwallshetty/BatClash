import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb';
import User from '@/models/User';

/**
 * Credentials provider for email/password authentication
 */
export const credentialsProvider = CredentialsProvider({
  name: 'Credentials',
  credentials: {
    email: { label: 'Email', type: 'email' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required');
    }

    await connectDB();

    const user = await User.findOne({ email: credentials.email }).select('+password');
    
    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      image: user.image,
    };
  },
});



