import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile,
  User 
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { auth, database } from './config';
import { UserProfile, ShippingAddress } from '../types';

/**
 * Register a new user with Firebase Auth and initialize their RTDB profile
 */
export async function registerUser(
  email: string, 
  password: string, 
  fullName: string, 
  phone?: string
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update Auth Profile
  await updateProfile(user, { displayName: fullName });

  // Store profile in Realtime Database
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email || email,
    displayName: fullName,
    phone: phone || '',
    createdAt: Date.now()
  };

  await set(ref(database, `users/${user.uid}`), userProfile);
  return user;
}

/**
 * Sign in existing user
 */
export async function loginUser(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Fetch user profile from RTDB
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await get(ref(database, `users/${uid}`));
    if (snap.exists()) {
      return snap.val() as UserProfile;
    }
  } catch (e) {
    console.warn('Get user profile error:', e);
  }
  return null;
}

/**
 * Update user address / phone in RTDB
 */
export async function updateUserProfile(
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> {
  await update(ref(database, `users/${uid}`), updates);
}

/**
 * Listen to Auth State
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
