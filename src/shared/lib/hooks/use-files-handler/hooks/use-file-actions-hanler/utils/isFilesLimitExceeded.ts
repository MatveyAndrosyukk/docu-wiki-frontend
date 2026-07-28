import {isUserAdminOrOwner} from "../../../../../utils/permissions-utils/isUserAdminOrOwner";
import {User} from "../../../../../../../store/slices/userSlice";
import {isUserPremiumActive} from "../../../../../utils/permissions-utils/isUserPremiumActive";

interface Params {
    viewedUser: User | null;

    totalFiles: number;

    filesToAdd: number;

    filesLimit: number;
}

export function isFilesLimitExceeded(
    {
        viewedUser,
        totalFiles,
        filesToAdd,
        filesLimit,
    }: Params
) {

    if (!viewedUser) {
        return true;
    }

    if (
        isUserPremiumActive(
            viewedUser
        )
    ) {
        return false;
    }

    if (
        isUserAdminOrOwner(
            viewedUser
        )
    ) {
        return false;
    }

    return (
        totalFiles + filesToAdd > filesLimit
    );

}