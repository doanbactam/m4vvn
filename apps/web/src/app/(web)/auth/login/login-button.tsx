'use client';

import { capitalCase } from 'change-case';
import { useSearchParams } from 'next/navigation';
import { type ComponentProps, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/common/button';
import { signIn } from '~/lib/auth-client';

type LoginButtonProps = ComponentProps<typeof Button> & {
  provider: 'google';
};

export const LoginButton = ({ provider, ...props }: LoginButtonProps) => {
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);
  const callbackURL = searchParams.get('callbackURL') || undefined;

  const handleSignIn = () => {
    signIn.social({
      provider,
      callbackURL,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onError: ({ error }) => {
          toast.error(error.message);
        },
      },
    });
  };

  return (
    <Button size="lg" onClick={handleSignIn} isPending={isPending} {...props}>
      Sign in with {capitalCase(provider)}
    </Button>
  );
};
