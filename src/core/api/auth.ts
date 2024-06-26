'use client';

import { isServer } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { listenApiEvent, mutateService } from './api';
import { getToken, removeToken, setToken } from './utils';

// TODO: Regulate system date-time if it was not correct

let refreshingTokenPromise: Promise<void> | undefined;
let expTime = 1;

const config = {
  refreshPath: 'core:/v1/auth/refresh-token',
  loginPath: 'core:/v1/auth/login/password',
  expDelaySec: 10,
};

listenApiEvent('request', (request) => {
  const { accessToken } = getToken();
  request.payload.headers ??= {};
  // if (request.url.startsWith('core')) return;
  request.payload.headers['Authorization'] = 'Bearer ' + accessToken;
});

function errorHandler(error: any) {
  if (error.status == 400) {
    logout();
  }
}

if (!isServer) {
  listenApiEvent('request', (request) => {
    const { refreshToken } = getToken();
    if (
      request.url.endsWith('core/auth/refresh-token') &&
      refreshToken &&
      !refreshingTokenPromise &&
      Date.now() > expTime - config.expDelaySec * 1000
    ) {
      refreshingTokenPromise = mutateService('post', 'core:/v1/auth/refresh-token').mutationFn!({
        params: { query: { refreshToken } },
      })
        .then(setToken, errorHandler)
        .finally(() => {
          refreshingTokenPromise = undefined;
        });
    }

    // TODO: only if auth needed
    request.waitForPromise = refreshingTokenPromise;
  });
}

listenApiEvent('data', (data, request) => {
  if (request.url.startsWith(config.loginPath) || request.url.startsWith(config.refreshPath)) {
    expTime = jwtDecode(data.accessToken).exp! * 1000;
    setToken(data);
  }
});

export function logout() {
  removeToken();
}

export {};
