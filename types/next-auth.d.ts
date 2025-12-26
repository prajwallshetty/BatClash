import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      xp: number;
      rank: string;
      streak: number;
      solvedCount: number;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    image?: string;
  }
}



