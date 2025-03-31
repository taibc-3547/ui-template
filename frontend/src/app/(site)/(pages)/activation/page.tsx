'use client';

import Link from 'next/link';
import { activationMessages } from '@/app/lib/fastschema/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { accountActivationAction, resendActivationLinkAction } from '@/app/lib/fastschema/actions';
import { onPostRegister } from '@/components/Auth/user';
import { FormPage } from '@/components/form-page';

export default function ActivationPage() {
  const [_, startTransition] = useTransition();
  const sp = useSearchParams();
  const status = sp.get('status') as keyof typeof activationMessages;
  const router = useRouter();
  const token = sp.get('token') ?? '';
  const [message, setMessage] = useState<string[]>([]);
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    if (status && activationMessages[status]) {
      setMessage(activationMessages[status]);
    }
  }, [status]);

  useEffect(() => {
    !token && setIsTokenExpired(false);
    token &&
      (async () => {
        setMessage(['Activating your account...']);
        startTransition(async () => {
          try {
            const res = await accountActivationAction(token);
            onPostRegister(router, res);
          } catch (e: any) {
            console.error('aaaaa', e);
            const isTokenExpired = e.message === 'token expired';
            isTokenExpired && setIsTokenExpired(true);
            const message = isTokenExpired ? 'Activation link expired.' : e.message;
            toast.error(message);
            setMessage([message]);
          }
        });
      })();
  }, [token]);

  const resendActivationLink = () => {
    startTransition(async () => {
      setMessage(['Sending activation email...']);
      try {
        const res = await resendActivationLinkAction(token);
        onPostRegister(router, {
          ...res,
          activation: 'sent' as unknown as 'activated',
        });
      } catch (e: any) {
        toast.error(e.message);
        setMessage([e.message]);
      }
    });
  };

  return (
    <FormPage
      title={
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Account Activation
        </h1>
      }
      description="Account Activation"
    >
      <form>
        <Toaster />
        <div className="text-center">
          {message.map((msg, i) => (
            <p key={i} className="mb-2">
              {msg}
            </p>
          ))}
        </div>
        <div className="note mt-4 text-center">
          {isTokenExpired && (
            <p>
              <a href="#" onClick={resendActivationLink} className="text-blue-500 underline">
                Click here to resend activation email
              </a>
            </p>
          )}

          <div className="mt-4 space-x-1 text-center text-sm">
            <Link href="/signin" className="text-muted-foreground underline underline-offset-4">
              Login
            </Link>
            <span className="text-muted-foreground"> or </span>
            <Link href="/" className="text-muted-foreground underline underline-offset-4">
              Go Home
            </Link>
          </div>
        </div>
      </form>
    </FormPage>
  );
}
