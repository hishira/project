import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OfferService } from '../offer.service';
import { Offer, OfferItem } from '../offer.model';

@Component({
  selector: 'app-offer-edit',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule,
    MatDividerModule, MatTooltipModule
  ],
  templateUrl: './offer-edit.component.html',
  styleUrls: ['./offer-edit.component.scss']
})
export class OfferEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private offerService = inject(OfferService);

  offerId: string | null = null;
  isEdit = false;
  form: FormGroup;

  clients = signal([
    { id: 'c1', name: 'Tymbark Sp. z o.o.' },
    { id: 'c2', name: 'Capri-Sun Polska' },
    { id: 'c3', name: 'PepsiCo Polska' }
  ]);

  constructor() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      clientId: ['', Validators.required],
      issueDate: [new Date(), Validators.required],
      validUntil: ['', Validators.required],
      currency: ['PLN', Validators.required],
      notes: [''],
      tags: [''],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.offerId = this.route.snapshot.paramMap.get('id');
    if (this.offerId) {
      this.isEdit = true;
      const offer = this.offerService.getOfferById(this.offerId);
      if (offer) {
        this.form.patchValue({
          title: offer.title,
          description: offer.description,
          clientId: offer.clientId,
          issueDate: offer.issueDate,
          validUntil: offer.validUntil,
          currency: offer.currency,
          notes: offer.notes,
          tags: offer.tags?.join(', ')
        });
        offer.items.forEach(item => this.addExistingItem(item));
      }
    } else {
      // Domyślnie jeden pusty wiersz
      this.addItem();
    }
  }

  get itemsArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  createItemForm(item?: OfferItem): FormGroup {
    return this.fb.group({
      id: [item?.id || this.generateId()],
      name: [item?.name || '', Validators.required],
      description: [item?.description || ''],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(0.01)]],
      unit: [item?.unit || 'szt', Validators.required],
      netPrice: [item?.netPrice || 0, [Validators.required, Validators.min(0)]],
      discountPercent: [item?.discountPercent || 0, [Validators.min(0), Validators.max(100)]],
      vatRate: [item?.vatRate || 23, [Validators.required, Validators.min(0), Validators.max(100)]],
      // Pola wyliczane – nieedytowalne
      netAmount: [{ value: item?.netAmount || 0, disabled: true }],
      vatAmount: [{ value: item?.vatAmount || 0, disabled: true }],
      grossAmount: [{ value: item?.grossAmount || 0, disabled: true }]
    });
  }

  addItem() {
    this.itemsArray.push(this.createItemForm());
  }

  addExistingItem(item: OfferItem) {
    this.itemsArray.push(this.createItemForm(item));
  }

  removeItem(index: number) {
    this.itemsArray.removeAt(index);
    this.calculateTotals();
  }

  // Symulacja ID
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  // Przeliczanie dla pojedynczej pozycji
  recalcItem(index: number) {
    const item = this.itemsArray.at(index) as FormGroup;
    const quantity = item.get('quantity')?.value || 0;
    const netPrice = item.get('netPrice')?.value || 0;
    const discountPercent = item.get('discountPercent')?.value || 0;
    const vatRate = item.get('vatRate')?.value || 0;

    const netBeforeDiscount = quantity * netPrice;
    const discountAmount = netBeforeDiscount * (discountPercent / 100);
    const netAmount = netBeforeDiscount - discountAmount;
    const vatAmount = netAmount * (vatRate / 100);
    const grossAmount = netAmount + vatAmount;

    item.patchValue({
      netAmount: Math.round(netAmount * 100) / 100,
      vatAmount: Math.round(vatAmount * 100) / 100,
      grossAmount: Math.round(grossAmount * 100) / 100
    }, { emitEvent: false });

    this.calculateTotals();
  }

  // Przelicz sumy całej oferty
  calculateTotals() {
    let totalNet = 0, totalVat = 0, totalGross = 0;
    this.itemsArray.controls.forEach(ctrl => {
      totalNet += ctrl.get('netAmount')?.value || 0;
      totalVat += ctrl.get('vatAmount')?.value || 0;
      totalGross += ctrl.get('grossAmount')?.value || 0;
    });
    // Można zapisać w formularzu lub wyświetlić w stopce
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.getRawValue();
    const items = formValue.items.map((item: any) => ({
      ...item,
      netAmount: item.netAmount,
      vatAmount: item.vatAmount,
      grossAmount: item.grossAmount
    }));

    const offerData = {
      number: this.isEdit ? undefined : `OF/${new Date().getFullYear()}/...`, // tymczasowo
      title: formValue.title,
      description: formValue.description,
      clientId: formValue.clientId,
      clientName: this.clients().find(c => c.id === formValue.clientId)?.name || '',
      issueDate: formValue.issueDate,
      validUntil: formValue.validUntil,
      status: 'draft' as const,
      items,
      totalNet: items.reduce((sum: number, i: any) => sum + i.netAmount, 0),
      totalVat: items.reduce((sum: number, i: any) => sum + i.vatAmount, 0),
      totalGross: items.reduce((sum: number, i: any) => sum + i.grossAmount, 0),
      currency: formValue.currency,
      notes: formValue.notes,
      tags: formValue.tags ? formValue.tags.split(',').map((t: string) => t.trim()) : [],
      createdBy: 'Aktualny użytkownik' // w rzeczywistości z auth
    };

    if (this.isEdit) {
      this.offerService.updateOffer(this.offerId!, offerData);
    } else {
      this.offerService.createOffer(offerData);
    }

    this.router.navigate(['/offers']);
  }
}