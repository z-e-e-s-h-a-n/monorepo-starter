import { API_URL, apiClient, executeApi } from "@workspace/sdk/lib/api-client";

/* =========================
   AUTH
   ========================= */

export const signUp = (data: SignUpType) =>
  executeApi(() => apiClient.post("/auth/signup", data));

export const signIn = (data: SignInType) =>
  executeApi<SignInResponse>(() => apiClient.post("/auth/signin", data));

export const signOut = () => executeApi(() => apiClient.post("/auth/signout"));

/* =========================
   OTP
   ========================= */

export const requestOtp = (data: RequestOtpType) =>
  executeApi(() => apiClient.post("/auth/request-otp", data));

export const validateOtp = (params: ValidateOtpType) =>
  executeApi<ValidateOtpResponse>(() =>
    apiClient.get("/auth/validate-otp", { params })
  );

/* =========================
   PASSWORD
   ========================= */

export const resetPassword = (data: ResetPasswordType) =>
  executeApi(() => apiClient.post("/auth/reset-password", data));

/* =========================
   IDENTIFIER CHANGE
   ========================= */

export const requestChangeIdentifier = (data: ChangeIdentifierType) =>
  executeApi(() => apiClient.post("/auth/change-identifier", data));

export const verifyChangeIdentifier = (params: ChangeIdentifierType) =>
  executeApi(() => apiClient.get("/auth/change-identifier", { params }));

/* =========================
   OAuth
   ========================= */

export const redirectToOAuth = (windowRef: any, provider: OAuthProvider) => {
  const clientUrl = windowRef.location.origin;
  windowRef.location.href = `${API_URL}/oauth/${provider}?clientUrl=${clientUrl}`;
};

/* =========================
   USER
   ========================= */

export const getCurrentUser = () =>
  executeApi<UserResponse>(() => apiClient.get("/auth/me"));
