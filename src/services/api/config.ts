import { Platform } from 'react-native';

const DEV_MACHINE_API_BASE_URL = 'http://192.168.35.48:3000/api';

export const API_BASE_URL =
  Platform.select({
    //android: 'http://10.0.2.2:3000/api',
    ios: DEV_MACHINE_API_BASE_URL,
    default: DEV_MACHINE_API_BASE_URL,
  }) ?? DEV_MACHINE_API_BASE_URL;

export const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
