export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve(window.Razorpay);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      if (!window.Razorpay) {
        reject(new Error('Razorpay not available after loading'));
      }
      resolve(window.Razorpay);
    };
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};