// src/services/cognitoAuth.js
import { useAuth } from "react-oidc-context";

// Helper to get the current Cognito ID token
export async function getIdToken() {
  // This function must be called inside a React component or hook
  // If called outside, fallback to window.authUser if available
  if (typeof window !== "undefined" && window.authUser?.id_token) {
    return window.authUser.id_token;
  }
  // Otherwise, try to get from react-oidc-context
  // (In practice, you should pass the idToken from the component)
  throw new Error("getIdToken must be called from a React context with access to the user");
}
