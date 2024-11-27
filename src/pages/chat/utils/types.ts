import { ConsentState, PermissionLevel } from "@xmtp/browser-sdk";

export interface CustomUserSafeGroupMember {
    name?: string
    accountAddresses: string[]
    address?: string
    canMessage?: boolean
    consentState?: ConsentState;
    inboxId?: string;
    installationIds?: string[];
    permissionLevel: PermissionLevel;
    pfp?: string;
  }
  