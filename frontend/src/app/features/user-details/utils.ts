import { State } from "../../core/mocks/user.mocks";
import { UserTypeCssClass } from "./types";

export const usetTypeToCssClassMapper: { [key in State]: UserTypeCssClass } = {
    [State.Active]: UserTypeCssClass.Active,
    [State.Inactive]: UserTypeCssClass.Inactive,
    [State.Suspended]: UserTypeCssClass.Suspended,
    [State.Deleted]: UserTypeCssClass.Deleted,
    [State.Unknown]: UserTypeCssClass.Unknown,
}