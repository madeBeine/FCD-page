import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { trackEvent } from "../hooks/useAnalytics";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleDownload = async (appLinks?: { ios: string; android: string }) => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  const iosLink = appLinks?.ios || 'https://apps.apple.com/app/fast-comand/id123456789';
  const androidLink = appLinks?.android || 'https://play.google.com/store/apps/details?id=com.fastcomand.app';

  // iOS detection
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    await trackEvent('download', { platform: 'ios' });
    window.open(iosLink, '_blank');
    return;
  }
  
  // Android detection
  if (/android/i.test(userAgent)) {
    await trackEvent('download', { platform: 'android' });
    window.open(androidLink, '_blank');
    return;
  }
  
  // Fallback for desktop or unknown
  await trackEvent('download', { platform: 'desktop_fallback' });
  alert('الرجاء زيارة هذه الصفحة من هاتفك المحمول لتحميل التطبيق، أو ابحث عن Fast Comand في متجر التطبيقات الخاص بك.\n\nPlease visit this page on your mobile device to download the app, or search for Fast Comand in your app store.');
};
