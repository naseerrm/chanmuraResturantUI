import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  User
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp
} from '@angular/fire/firestore';

import { BehaviorSubject } from 'rxjs';

/**
 * AuthService
 * ------------------------------------------------
 * - Firebase Authentication
 * - Firestore user + company context
 * - Industry & role state for routing & guards
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  /* ========= AUTH STATE ========= */
  private uidSubject = new BehaviorSubject<string | null>(null);
  uid$ = this.uidSubject.asObservable();

  /* ========= CONTEXT STATE ========= */
  private industrySubject = new BehaviorSubject<string | null>(
    localStorage.getItem('industry')
  );
  industry$ = this.industrySubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('role')
  );
  role$ = this.roleSubject.asObservable();

  constructor(
    private auth: Auth,
    private fs: Firestore
  ) {
    /**
     * Sync context on auth state change (page refresh safe)
     */
    this.auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.uidSubject.next(user.uid);
        await this.loadUserContext(user.uid);
      } else {
        this.clearContext();
      }
    });
  }

  /* =====================================================
     CONTEXT LOADER
     ===================================================== */
  private async loadUserContext(uid: string) {
    try {
      const userSnap = await getDoc(doc(this.fs, `users/${uid}`));
      if (!userSnap.exists()) {
        this.clearContext();
        return;
      }

      const user = userSnap.data() as any;
      const role = user.role ?? 'USER';
      this.setRole(role);

      if (user.companyId) {
        const companySnap = await getDoc(
          doc(this.fs, `companies/${user.companyId}`)
        );

        if (companySnap.exists()) {
          const company = companySnap.data() as any;
          this.setIndustry(company.industry ?? null);
          return;
        }
      }

      // User exists but no company yet
      this.setIndustry(null);

    } catch (error) {
      console.error('[AuthService] loadUserContext failed', error);
      this.clearContext();
    }
  }

  /* =====================================================
     SIGNUP
     ===================================================== */
  async signup(
    email: string,
    mobile: string,
    password: string,
    isOwner = true,
    companyId?: string
  ) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = cred.user.uid;

    await setDoc(doc(this.fs, `users/${uid}`), {
      uid,
      email,
      mobile,
      companyId: companyId ?? null,
      role: isOwner ? 'ADMIN' : 'STAFF',
      createdAt: serverTimestamp()
    });

    if (companyId) {
      await setDoc(doc(this.fs, `companies/${companyId}/users/${uid}`), {
        uid,
        role: isOwner ? 'ADMIN' : 'STAFF',
        status: 'ACTIVE',
        createdAt: serverTimestamp()
      });
    }

    return { uid };
  }

  /* =====================================================
     LOGIN
     ===================================================== */
  async login(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const uid = cred.user.uid;

    await this.loadUserContext(uid);
    const companyId = cred.user.companyId ?? null;
    return {
      uid : uid,
      industry: this.industrySubject.value,
      role: this.roleSubject.value,
      companyId: companyId
    };
  }

  /* =====================================================
     COMPANY SETUP
     ===================================================== */
  async setIndustryForCompany(companyId: string, industry: string) {
    const companyRef = doc(this.fs, `companies/${companyId}`);
    await updateDoc(companyRef, {
      industry,
      updatedAt: serverTimestamp()
    });

    this.setIndustry(industry);
  }

  /* =====================================================
     PASSWORD RESET
     ===================================================== */
  forgotPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  /* =====================================================
     LOGOUT
     ===================================================== */
  async logout() {
    await this.auth.signOut();
    this.clearContext();
  }

  /* =====================================================
     CONTEXT SETTERS / GETTERS (USED BY GUARDS)
     ===================================================== */
  getIndustry(): string | null {
    return this.industrySubject.value;
  }

  getRole(): string | null {
    return this.roleSubject.value;
  }

  getCurrentUid(): string | null {
    return this.auth.currentUser?.uid ?? null;
  }

  /* =====================================================
     PRIVATE HELPERS
     ===================================================== */
  private setIndustry(industry: string | null) {
    this.industrySubject.next(industry);
    industry
      ? localStorage.setItem('industry', industry)
      : localStorage.removeItem('industry');
  }

  private setRole(role: string | null) {
    this.roleSubject.next(role);
    role
      ? localStorage.setItem('role', role)
      : localStorage.removeItem('role');
  }

  private clearContext() {
    this.uidSubject.next(null);
    this.industrySubject.next(null);
    this.roleSubject.next(null);
    localStorage.removeItem('industry');
    localStorage.removeItem('role');
  }
}
