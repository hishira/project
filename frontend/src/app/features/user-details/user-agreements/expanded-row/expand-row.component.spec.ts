// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatButtonModule } from '@angular/material/button';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatIconModule } from '@angular/material/icon';
// import { AgreementTableItem } from '../types';
// import { UserAgreementExpandedRow } from './expanded-row.component';

// describe('UserAgreementExpandedRow', () => {
//     let component: UserAgreementExpandedRow;
//     let fixture: ComponentFixture<UserAgreementExpandedRow>;

//     const mockAgreement: AgreementTableItem = {
//         contractId: 'CONT-123',
//         productName: 'Test Product',
//         totalValue: 15000,
//         currency: 'USD',
//         riskLevel: 'MEDIUM',
//         riskScore: 65,
//         status: 'ACTIVE',
//         effectiveDate: new Date('2024-01-01'),
//         fullData: {
//             contractId: 'CONT-123',
//             version: { version: '2.0.0' },
//             createdAt: new Date('2023-12-01'),
//             updatedAt: new Date('2024-01-15'),
//             product: {
//                 name: 'Test Product',
//                 category: 'SOFTWARE_LICENSE',
//                 specifications: { applications: ['App1', 'App2', 'App3'] }
//             },
//             paymentSchedule: [
//                 { dueDate: new Date('2024-02-01'), amount: 5000, status: 'PAID' },
//                 { dueDate: new Date('2024-03-01'), amount: 5000, status: 'PENDING' },
//                 { dueDate: new Date('2024-04-01'), amount: 5000, status: 'PENDING' }
//             ],
//             riskAssessment: {
//                 mitigationPlan: 'This is a test mitigation plan that is longer than 100 characters to test the truncation functionality in the component.'
//             },
//             tags: ['software', 'license', 'enterprise'],
//             isMasterContract: true,
//             signatures: [
//                 { userId: 'user1', signedAt: new Date('2024-01-02') },
//                 { userId: 'user2', signedAt: new Date('2024-01-03') }
//             ]
//         },
//         //tags: ['software', 'license'],
//         signaturesCount: 2,
//         requiredSignatures: 3
//     } as AgreementTableItem;

//     beforeEach(async () => {
//         await TestBed.configureTestingModule({
//             imports: [
//                 MatChipsModule,
//                 MatIconModule,
//                 MatButtonModule
//             ],
//             declarations: [UserAgreementExpandedRow]
//         }).compileComponents();

//         fixture = TestBed.createComponent(UserAgreementExpandedRow);
//         component = fixture.componentInstance;
//     });

//     it('should create component', () => {
//         expect(component).toBeTruthy();
//     });

//     describe('getRiskColor', () => {
//         it('should return correct color for LOW risk', ( => {
//             expect(component.getRiskColor('LOW')).toBe('test');
//         });

//         it('should return correct color for MEDIUM risk', () => {
//             expect(component.getRiskColor('MEDIUM')).toBe('primary');
//         });

//         it('should return correct color for HIGH risk', () => {
//             expect(component.getRiskColor('HIGH')).toBe('warn');
//         });

//         it('should return correct color for CRITICAL risk', () => {
//             expect(component.getRiskColor('CRITICAL')).toBe('warn');
//         });

//         it('should return basic for unknown risk level', () => {
//             expect(component.getRiskColor('UNKNOWN')).toBe('basic');
//         });
//     });

//     describe('formatCurrency', () => {
//         it('should format currency correctly for USD', () => {
//             const result = component.formatCurrency(15000, 'USD');
//             expect(result).toContain('$');
//             expect(result).toContain('15,000');
//         });

//         it('should format currency correctly for EUR', () => {
//             const result = component.formatCurrency(20000, 'EUR');
//             expect(result).toContain('€');
//         });

//         it('should return N/A for missing value', () => {
//             expect(component.formatCurrency(undefined as any, 'USD')).toBe('N/A');
//         });

//         it('should return N/A for missing currency', () => {
//             expect(component.formatCurrency(15000, '')).toBe('N/A');
//         });
//     });

//     describe('formatDate', () => {
//         it('should format date object correctly', () => {
//             const date = new Date('2024-01-15');
//             const result = component.formatDate(date);
//             expect(result).toContain('Jan');
//             expect(result).toContain('15');
//             expect(result).toContain('2024');
//         });

//         it('should format date string correctly', () => {
//             const dateStr = '2024-01-15';
//             const result = component.formatDate(dateStr);
//             expect(result).toContain('Jan');
//             expect(result).toContain('15');
//             expect(result).toContain('2024');
//         });

//         it('should return N/A for undefined date', () => {
//             expect(component.formatDate(undefined)).toBe('N/A');
//         });

//         it('should return "Invalid date" for invalid date string', () => {
//             expect(component.formatDate('invalid-date')).toBe('Invalid date');
//         });
//     });

//     describe('getPendingPayment', () => {
//         it('should find pending payment in schedule', () => {
//             const pendingPayment = component.getPendingPayment(mockAgreement.fullData!.paymentSchedule!);
//             expect(pendingPayment).toBeTruthy();
//             expect(pendingPayment.dueDate).toBeInstanceOf(Date);
//             expect(pendingPayment.status).toBe('PENDING');
//         });

//         it('should return undefined for empty schedule', () => {
//             expect(component.getPendingPayment([])).toBeUndefined();
//         });

//         it('should return undefined for undefined schedule', () => {
//             expect(component.getPendingPayment(undefined as any)).toBeUndefined();
//         });
//     });

//     describe('getDaysUntilExpiration', () => {
//         it('should calculate days correctly for future date', () => {
//             const futureDate = new Date();
//             futureDate.setDate(futureDate.getDate() + 10);
//             const days = component.getDaysUntilExpiration(futureDate);
//             expect(days).toBe(10);
//         });

//         it('should return negative days for past date', () => {
//             const pastDate = new Date();
//             pastDate.setDate(pastDate.getDate() - 5);
//             const days = component.getDaysUntilExpiration(pastDate);
//             expect(days).toBe(-5);
//         });
//     });

//     describe('getStatusColor', () => {
//         it('should return correct color for ACTIVE status', () => {
//             expect(component.getStatusColor('ACTIVE')).toBe('accent');
//         });

//         it('should return correct color for EXPIRED status', () => {
//             expect(component.getStatusColor('EXPIRED')).toBe('warn');
//         });

//         it('should return correct color for PENDING_APPROVAL status', () => {
//             expect(component.getStatusColor('PENDING_APPROVAL')).toBe('primary');
//         });

//         it('should return correct color for DRAFT status', () => {
//             expect(component.getStatusColor('DRAFT')).toBe('basic');
//         });

//         it('should return correct color for SUSPENDED status', () => {
//             expect(component.getStatusColor('SUSPENDED')).toBe('warn');
//         });

//         it('should return basic for unknown status', () => {
//             expect(component.getStatusColor('UNKNOWN')).toBe('basic');
//         });
//     });
// });