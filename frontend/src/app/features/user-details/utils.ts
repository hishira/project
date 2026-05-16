import { State } from "../../core/mocks/user.mocks";
import { UserTypeCssClass } from "./types";

export const usetTypeToCssClassMapper: { [key in State]: UserTypeCssClass } = {
    [State.Active]: UserTypeCssClass.Active,
    [State.Inactive]: UserTypeCssClass.Inactive,
    [State.Suspended]: UserTypeCssClass.Suspended,
    [State.Deleted]: UserTypeCssClass.Deleted,
    [State.Unknown]: UserTypeCssClass.Unknown,
}


export function getDaysUntilExpiration(expirationDate: Date): number {
    const now = new Date();
    const exp = new Date(expirationDate);
    const diffTime = exp.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}