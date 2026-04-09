import { AgreementRiskStatus, AgreementStatus, AgreementStatusColor, AgreementStatusType } from "../types";

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

export const agreementStatusLowerCase = (status: AgreementStatusType): string =>
    status ? status.toLowerCase() : '';