import { apiClient, executeApi } from "@workspace/sdk/lib/api-client";

export const createCustomer = (data: SignUpType) => {
  return executeApi(() => apiClient.post("/admin/customers", data));
};

export const findAllUsers = (params?: UserQueryType) => {
  return executeApi<UserQueryResponse>(() =>
    apiClient.get("/admin/users", { params })
  );
};
