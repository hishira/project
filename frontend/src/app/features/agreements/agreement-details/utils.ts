import { AgreementRiskStatus, AgreementStatus, AgreementStatusColor } from "../types";

export const agreementStatusColorMap = (status: AgreementStatus): AgreementStatusColor => {
    switch (status) {
        case AgreementStatus.ACTIVE: return 'accent';
        case AgreementStatus.EXPIRED: return 'warn';
        case AgreementStatus.PENDING_APPROVAL: return 'primary';
        case AgreementStatus.DRAFT: return 'basic';
        case AgreementStatus.SUSPENDED: return 'warn';
        default: return 'basic';
    }
}

export const agreementRiskColorMap = (riskLevel: AgreementRiskStatus): AgreementStatusColor => {
    switch (riskLevel) {
        case AgreementRiskStatus.LOW: return 'accent';
        case AgreementRiskStatus.MEDIUM: return 'primary';
        case AgreementRiskStatus.HIGH: return 'warn';
        case AgreementRiskStatus.CRITICAL: return 'warn';
        default: return 'basic';
    }
}

export const agreementStatusLowerCase = <T extends string>(status: T): Lowercase<T> =>
    (status ? status.toLowerCase() : '') as Lowercase<T>;