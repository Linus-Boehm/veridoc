import type { Organization, User } from "./organization";

export interface AppContext {
    organization: Organization;
    user: User;
}
