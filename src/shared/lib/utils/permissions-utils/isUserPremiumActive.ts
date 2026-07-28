import {User} from "../../../../store/slices/userSlice";

export function isUserPremiumActive(
    user: User | null
): boolean {

    if (!user) {
        return false;
    }

    if (!user.premiumExpiresAt) {
        return false;
    }

    return new Date(
        user.premiumExpiresAt
    ) > new Date();
}