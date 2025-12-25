'use client';

import { SessionProvider } from 'next-auth/react';
import { EmojiProvider } from 'react-apple-emojis';
import emojiData from 'react-apple-emojis/src/data.json';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <EmojiProvider data={emojiData}>
        {children}
      </EmojiProvider>
    </SessionProvider>
  );
}


