import {
    signInWithPopup,
    AuthErrorCodes,
    GoogleAuthProvider,
    GithubAuthProvider,
    FacebookAuthProvider,
    type AuthProvider,
    type AuthError,
} from 'firebase/auth';
import { auth } from './config';

const providerNames: Record<string, string> = {
    [GoogleAuthProvider.PROVIDER_ID]: 'Google',
    [GithubAuthProvider.PROVIDER_ID]: 'GitHub',
    [FacebookAuthProvider.PROVIDER_ID]: 'Facebook',
};

export interface FirebaseAuthResult {
    id_token: string
    correo: string | null
    provider: string | null
}

export async function signInWithProvider(provider: AuthProvider): Promise<FirebaseAuthResult> {
    try {
        const result = await signInWithPopup(auth, provider);
        const id_token = await result.user.getIdToken();
        const correo = result.user.email ?? result.user.providerData[0]?.email ?? null;
        const providerId = result.user.providerData[0]?.providerId ?? null;
        return { id_token, correo, provider: providerId };
    } catch (err) {
        const error = err as AuthError;

        if (error.code === AuthErrorCodes.NEED_CONFIRMATION) {
            const tokenResponse = (error.customData as Record<string, unknown>)
                ?._tokenResponse as Record<string, string[]> | undefined;
            const existingProviderId = tokenResponse?.verifiedProvider?.[0];
            const existingProviderName = existingProviderId ? providerNames[existingProviderId] : null;

            if (existingProviderName) {
                throw new Error(`Este correo ya está registrado con ${existingProviderName}. Inicia sesión con ${existingProviderName}.`);
            }
        }

        throw err;
    }
}
