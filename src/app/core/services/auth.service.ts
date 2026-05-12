// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { Firestore, doc, getDoc,setDoc } from '@angular/fire/firestore';
// import { Auth,createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
// import { SignupModel } from '../models/signup.model';

// @Injectable({ providedIn: 'root' })
// export class AuthService {
//   // keep existing methods (signup/login) ...
//   private industrySubject = new BehaviorSubject<string | null>(null);
//   public industry$ = this.industrySubject.asObservable();

//   constructor(private auth: Auth, private fs: Firestore) {
//      console.log('Firebase Auth Loaded:', this.auth);
//     // optional: on auth state change, load profile and set industry
//     // (you can also set industry after login/signup explicitly)
//     this.auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         await this.loadUserIndustry(user.uid);
//       } else {
//         this.industrySubject.next(null);
//       }
//     });
//   }

//   async loadUserIndustry(uid: string) {
//     try {
//       const userRef = doc(this.fs, `users/${uid}`);
//       const userSnap = await getDoc(userRef);
//       if (userSnap.exists()) {
//         const data = userSnap.data() as any;
//         this.industrySubject.next(data?.industry ?? null);
//       } else {
//         this.industrySubject.next(null);
//       }
//     } catch (err) {
//       console.error('loadUserIndustry error', err);
//       this.industrySubject.next(null);
//     }
//   }

//   // call this after successful login/signup
//   setIndustry(industry: string | null) {
//     this.industrySubject.next(industry);
//   }

//   // implement signOut wrapper to clear industry
//   async logout() {
//     await this.auth.signOut();
//     this.industrySubject.next(null);
//   }

//   async login(mobile: string, password: string) {
//     const email = `${mobile}@chanmura.com`;

//     const userCred = await signInWithEmailAndPassword(this.auth, email, password);
//     const uid = userCred.user.uid;

//     const userRef = doc(this.fs, `users/${uid}`);
//     const userSnap = await getDoc(userRef);

//     if (!userSnap.exists()) throw new Error('Profile missing');
//     return userSnap.data()?.industry;
//   }

//     async signup(signup : SignupModel) {
//     const email = `${signup.mobile}@chanmura.com`;

//     const companyRef = doc(this.fs, `companies/${signup.companyCode}`);
//     const companySnap = await getDoc(companyRef);
//     if (!companySnap.exists()) throw new Error('Company Code does not exist');

//     const { industry } = companySnap.data() as any;

//     const userCred = await createUserWithEmailAndPassword(this.auth, email, signup.password);

//     const userRef = doc(this.fs, `users/${userCred.user.uid}`);
//     await setDoc(userRef, {
//       uid: userCred.user.uid,
//       companyCode: signup.companyCode,
//       mobile: signup.mobile,
//       industry,
//       createdAt: new Date()
//     });

//     return industry;
//   }
// }
//import { serverTimestamp } from 'firebase/firestore';

import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,sendPasswordResetEmail } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc, updateDoc,serverTimestamp } from '@angular/fire/firestore';
//import { serverTimestamp } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userUidSubject = new BehaviorSubject<string | null>(null);
  userUid$ = this.userUidSubject.asObservable();

  private industrySubject = new BehaviorSubject<string | null>(null);
  industry$ = this.industrySubject.asObservable();

  constructor(private auth: Auth, private fs: Firestore) {
    // Populate on auth state change
    this.auth.onAuthStateChanged(async (u) => {
      if (u) {
        this.userUidSubject.next(u.uid);
        await this.syncUserContext(u.uid);
      } else {
        this.userUidSubject.next(null);
        this.industrySubject.next(null);
      }
    });
  }

async syncUserContext(uid: string) {
  try {
    const userRef = doc(this.fs, `users/${uid}`);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      this.industrySubject.next(null);
      return;
    }

    const user = userSnap.data() as any;

    if (user.companyId) {
      const companyRef = doc(this.fs, `companies/${user.companyId}`);
      const companySnap = await getDoc(companyRef);

      if (companySnap.exists()) {
        const company = companySnap.data() as any;
        this.industrySubject.next(company.industry ?? null);
        return;
      }
    }

    // CompanyId null or company not found
    this.industrySubject.next(null);
  } catch (err) {
    console.error("syncUserContext failed", err);
    this.industrySubject.next(null);
  }
}

  // Create user (owner or staff)
  async signup(email : string,mobile: string, password: string, isOwner = true, companyCode?: string) {
  try {
    //const email = `${mobile}@chanmura.local`; // pseudo-email
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const uid = cred.user.uid;
    console.log("Created user UID:", uid);

    // create users/{uid}
    await setDoc(doc(this.fs, `users/${uid}`), {
      uid,
      mobile,
      isOwner,
      companyId: companyCode ?? null,
      role: isOwner ? 'OWNER' : 'user',
      createdAt: serverTimestamp()
    });

    // company
    if (companyCode) {
      const companyRef = doc(this.fs, `companies/${companyCode}`);
      const companySnap = await getDoc(companyRef);

      if (companySnap.exists()) {
        await setDoc(doc(this.fs, `companies/${companyCode}/users/${uid}`), {
          uid,
          role: isOwner ? 'OWNER' : 'STAFF',
          status: 'ACTIVE',
          createdAt: serverTimestamp()
        });

        const company = companySnap.data() as any;
        if (company?.industry) this.industrySubject.next(company.industry);
      }
    }

    return { uid };

  } catch (error: any) {
    console.error("SIGNUP FAILED:", error.code, error.message, error);
    throw error;
  }
}

 forgotPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  // Login
  async login(email: string, password: string) {
    //const email = `${mobile}@chanmura.local`;
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const uid = cred.user.uid;

    // read users/{uid}
    const uSnap = await getDoc(doc(this.fs, `users/${uid}`));
    if (!uSnap.exists()) throw new Error('User profile missing');
    const user = uSnap.data() as any;

    // companyId might be null (single-user mode)
    const companyId = user.companyId ?? null;
    if (companyId) {
      const cSnap = await getDoc(doc(this.fs, `companies/${companyId}`));
      if (cSnap.exists()) {
        const comp = cSnap.data() as any;
        this.industrySubject.next(comp.industry ?? null);
        return { uid, companyId, industry: comp.industry ?? null, role: user.role };
      }
    }
    // no company -> onboarding required
    this.industrySubject.next(null);
    return { uid, companyId: null, industry: null, role: user.role };
  }

  async setIndustryForCompany(companyCode: string, industry: string) {
    const cRef = doc(this.fs, `companies/${companyCode}`);
    const cSnap = await getDoc(cRef);
    if (!cSnap.exists()) throw new Error('Company not found');
    await updateDoc(cRef, { industry, updatedAt: serverTimestamp() });
    this.industrySubject.next(industry);
  }

  async logout() {
    await this.auth.signOut();
    this.userUidSubject.next(null);
    this.industrySubject.next(null);
  }

  getCurrentUid() {
    return this.auth.currentUser?.uid ?? null;
  }
}


