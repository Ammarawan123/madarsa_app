import { Strings } from "@/constants/strings";
import { AuthUser, LoginCredentials, LoginResult } from "@/types/auth.types";
import { IAuthStrategy } from "./IAuthStrategy";

const AUTH_API_URL = "https://6a9578b5fa33b37f821aaf01.mockapi.io/leaverequest";

const DEMO_USER: AuthUser = {
  id: "qari-001",
  name: "عبداللہ احمد",
  mobileNumber: "03001234567",
  role: "qari",
  assignedClass: "حفظ - درجہ اول",
};

const DEMO_PASSWORD = "123456";

const normalizePhoneNumber = (value?: string) =>
  (value ?? "").replace(/\D/g, "");

const isDemoLoginMatch = (credentials: LoginCredentials) => {
  const normalizedInput = normalizePhoneNumber(credentials.mobileNumber);
  const normalizedDemo = normalizePhoneNumber(DEMO_USER.mobileNumber);

  return (
    normalizedInput === normalizedDemo && credentials.password === DEMO_PASSWORD
  );
};

const normalizeApiUser = (item: any): AuthUser | null => {
  if (!item || typeof item !== "object") {
    return null;
  }

  const rawMobile =
    typeof item.mobileNumber === "string"
      ? item.mobileNumber
      : typeof item.phone === "string"
        ? item.phone
        : typeof item.studentName === "string"
          ? item.studentName
          : "";

  const rawName =
    typeof item.name === "string"
      ? item.name
      : typeof item.studentName === "string"
        ? item.studentName
        : "User";

  const role =
    item.role === "admin" || item.role === "qari" ? item.role : "qari";

  if (!rawMobile && !item.password) {
    return null;
  }

  return {
    id: String(item.id ?? rawName ?? "user-id"),
    name: rawName,
    mobileNumber: normalizePhoneNumber(rawMobile) || "03000000000",
    role,
    assignedClass:
      typeof item.assignedClass === "string"
        ? item.assignedClass
        : typeof item.grade === "string"
          ? item.grade
          : undefined,
  };
};

export class ApiAuthStrategy implements IAuthStrategy {
  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const demoMatch = isDemoLoginMatch(credentials);

    if (demoMatch) {
      return { success: true, user: DEMO_USER };
    }

    try {
      const response = await fetch(AUTH_API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      const records = Array.isArray(payload) ? payload : [payload];

      for (const item of records) {
        const apiUser = normalizeApiUser(item);
        if (!apiUser || !item || typeof item !== "object") {
          continue;
        }

        const hasPasswordField = typeof item.password === "string";
        const isPasswordMatch = hasPasswordField
          ? item.password === credentials.password
          : true;

        const normalizedApiMobile = normalizePhoneNumber(apiUser.mobileNumber);
        const normalizedInput = normalizePhoneNumber(credentials.mobileNumber);

        if (
          normalizedApiMobile === normalizedInput &&
          isPasswordMatch &&
          apiUser.name
        ) {
          return {
            success: true,
            user: {
              ...apiUser,
              role: apiUser.role,
            },
          };
        }
      }

      return {
        success: false,
        errorMessage: Strings.errors.invalidCredentials,
      };
    } catch {
      return {
        success: false,
        errorMessage: Strings.errors.networkError,
      };
    }
  }
}
