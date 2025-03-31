'use client';
import Link from 'next/link';
import { ActivationStatus, User } from 'fastschema';
import { useTransition } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { logoutAction } from '@/app/lib/fastschema/actions';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { registerMessages } from '@/app/lib/fastschema/constants';

export const UserMenu = ({ user }: { user: User | null }) => {
  const [_, startTransaction] = useTransition();
  return (
    <>
      <Toaster />
      {user ? (
        <div className="space-x-2">
          <div className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-yellow-200 dark:bg-yellow-700">
            <span className="font-medium text-yellow-700 dark:text-yellow-400">
              {user?.username ? user.username.slice(0, 2).toLocaleUpperCase() : 'UN'}
            </span>
          </div>
          <button
            className="text-sm font-medium text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
            onClick={() => {
              if (confirm('Are you sure you want to logout?')) {
                startTransaction(async () => {
                  try {
                    logoutAction();
                    toast.success('You have been logged out.', {
                      duration: 5000,
                      style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                        color: "#fff",
                      },
                      icon: "👋",
                    });
                  } catch (e: any) {
                    toast.error('Failed to logout: ' + e.message, {
                      duration: 5000,
                      style: {
                        background: '#FEE2E2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        padding: '16px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      },
                      icon: '⚠️',
                    });
                  }
                });
              }
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <Link
            href="/login"
            prefetch={true}
            className="text-sm font-medium text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            Login
          </Link>
        </div>
      )}
    </>
  );
};

export const onPostRegister = (
  router: AppRouterInstance,
  result?: ActivationStatus
) => {
  if (!result) return;
  
  toast.success(registerMessages[result.activation], {
    duration: 5000,
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
      color: "#fff",
    },
    icon: "🎉",
  });

  if (['activated', 'auto'].includes(result.activation)) {
    router.push('/signin');
    return;
  }

  if (['manual', 'email', 'sent'].includes(result.activation)) {
    router.push('/activation?status=' + result.activation);
    return;
  }
};
