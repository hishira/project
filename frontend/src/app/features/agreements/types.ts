export enum AgreementStatus {
 ACTIVE = 'ACTIVE',
 EXPIRED = 'EXPIRED',
 PENDING_APPROVAL = 'PENDING_APPROVAL',
 DRAFT = 'DRAFT',
 SUSPENDED = 'SUSPENDED',   
}
export type AgreementStatusColor = 'accent' | 'warn' | 'primary' | 'basic';

export enum AgreementRiskStatus {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
}

