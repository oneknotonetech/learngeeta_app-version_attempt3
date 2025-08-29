import { PermissionManager } from './helper_register';

/**
 * Test script to verify permission handling
 * Run this to check if permissions are working correctly
 */

export const testPermissions = async () => {
  console.log('🧪 Testing permission handling...');
  
  try {
    // Test notification permissions
    console.log('📱 Testing notification permissions...');
    const notificationStatus = await PermissionManager.requestNotificationPermissions();
    console.log('✅ Notification permission result:', notificationStatus);
    
    // Test storage and camera permissions
    console.log('📁 Testing storage and camera permissions...');
    const storageStatus = await PermissionManager.requestStorageAndCameraPermissions();
    console.log('✅ Storage and camera permission result:', storageStatus);
    
    // Check if all permissions are granted
    const allGranted = PermissionManager.areAllPermissionsGranted(storageStatus);
    console.log('✅ All permissions granted:', allGranted);
    
    console.log('🎉 Permission testing completed successfully!');
    return {
      notificationStatus,
      storageStatus,
      allGranted
    };
  } catch (error) {
    console.error('❌ Permission testing failed:', error);
    throw error;
  }
};

// Export for use in other files
export default testPermissions;
