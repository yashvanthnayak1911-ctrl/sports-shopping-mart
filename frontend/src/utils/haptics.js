// Haptic feedback utility
export const hapticFeedback = (type = 'light') => {
  // Check if vibration API is supported
  if (navigator.vibrate) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
      case 'success':
        navigator.vibrate([10, 50, 10]);
        break;
      case 'error':
        navigator.vibrate([50, 100, 50]);
        break;
      default:
        navigator.vibrate(15);
    }
  }
};
