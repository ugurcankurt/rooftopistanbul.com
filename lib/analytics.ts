export const sendGAEvent = (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', eventName, params);
    } else {
        console.log(`GA Event: ${eventName}`, params);
    }
};
