import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name,
      );
      if (userAccount) {
        // call another method
        return await this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (error) {
      console.error("Appwrite signup error:", error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      console.log("Attempting login with email:", email);

      // Clear any existing sessions before creating a new one
      try {
        await this.account.deleteSessions();
      } catch (e) {
        // Ignore errors if no sessions exist
      }

      const session = await this.account.createEmailPasswordSession(
        email,
        password,
      );
      console.log("Login successful:", session);
      return session;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      // Expected 401 error when user is not logged in on app load
      return null;
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite serive :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
