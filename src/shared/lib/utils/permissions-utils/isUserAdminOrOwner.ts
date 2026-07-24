import {User} from "../../../../store/slices/userSlice";

export const isUserAdminOrOwner = (
    user: User | null,
) => {

    return !!user?.roles.some(
        role =>
            [
                "ADMIN",
                "OWNER",
            ].includes(
                role.value
            )
    );

};