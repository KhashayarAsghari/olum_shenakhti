'use client';

import { useProfile } from '@/hooks';
import { getScopeUrl } from '@/utils/scope';
import Link from 'next/link';

function hasManagementPermission(profile: Schema<'UserInfoDTO'>, scopeId: number) {
  return profile.roles?.some(
    (r) => (r as any).scopeId === +scopeId || r.authorities!.includes('OP_USER_BLOCK_AND_UNBLOCK'),
  );
}

export default function AuthDialogController({ scopeId }: { scopeId: number }) {
  const profile = useProfile({ throwOnError: false, retry: 0 });

  return profile && hasManagementPermission(profile, scopeId) ? (
    <Link className="btn btn-info btn-link" href={`${getScopeUrl(scopeId)}/management/users`}>مدیریت کاربران</Link>
  ) : null;
}
