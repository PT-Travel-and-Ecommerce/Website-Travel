'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface FareItem {
  id: string;
  name: string;
  amount: string;
}

interface DynamicFareFormProps {
  baseFare: string;
  tax: string;
  discount: string;
  otherFees: FareItem[];
  onBaseFareChange: (value: string) => void;
  onTaxChange: (value: string) => void;
  onDiscountChange: (value: string) => void;
  onOtherFeesChange: (fees: FareItem[]) => void;
}

export default function DynamicFareForm({
  baseFare,
  tax,
  discount,
  otherFees,
  onBaseFareChange,
  onTaxChange,
  onDiscountChange,
  onOtherFeesChange,
}: DynamicFareFormProps) {
  const addFeeItem = () => {
    const newFee: FareItem = {
      id: `fee-${Date.now()}`,
      name: '',
      amount: '0',
    };
    onOtherFeesChange([...otherFees, newFee]);
  };

  const removeFeeItem = (id: string) => {
    onOtherFeesChange(otherFees.filter(fee => fee.id !== id));
  };

  const updateFeeItem = (id: string, field: 'name' | 'amount', value: string) => {
    onOtherFeesChange(
      otherFees.map(fee =>
        fee.id === id ? { ...fee, [field]: value } : fee
      )
    );
  };

  const calculateTotal = () => {
    const base = parseFloat(baseFare) || 0;
    const taxAmt = parseFloat(tax) || 0;
    const disc = parseFloat(discount) || 0;
    const otherTotal = otherFees.reduce((sum, fee) => sum + (parseFloat(fee.amount) || 0), 0);
    return base + taxAmt + otherTotal - disc;
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Rincian Tarif</h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseFare">Tarif Dasar (Rp)</Label>
          <Input
            type="number"
            id="baseFare"
            min="0"
            value={baseFare}
            onChange={(e) => onBaseFareChange(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax">Pajak (Rp)</Label>
          <Input
            type="number"
            id="tax"
            min="0"
            value={tax}
            onChange={(e) => onTaxChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Biaya Tambahan</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFeeItem}
          >
            <Plus className="w-4 h-4 mr-1" />
            Tambah Biaya
          </Button>
        </div>

        {otherFees.length === 0 ? (
          <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded-lg">
            Belum ada biaya tambahan. Klik "Tambah Biaya" untuk menambahkan.
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-3">
            {otherFees.map((fee) => (
              <div key={fee.id} className="flex gap-2 items-end">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">Nama Biaya</Label>
                  <Input
                    type="text"
                    placeholder="Contoh: Biaya WiFi"
                    value={fee.name}
                    onChange={(e) => updateFeeItem(fee.id, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="w-40 space-y-1">
                  <Label className="text-xs">Jumlah (Rp)</Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={fee.amount}
                    onChange={(e) => updateFeeItem(fee.id, 'amount', e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeFeeItem(fee.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="discount">Diskon (Rp)</Label>
        <Input
          type="number"
          id="discount"
          min="0"
          value={discount}
          onChange={(e) => onDiscountChange(e.target.value)}
        />
      </div>

      <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border-2 border-primary/30">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Tarif Dasar:</span>
            <span>{formatRupiah(parseFloat(baseFare) || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Pajak:</span>
            <span>{formatRupiah(parseFloat(tax) || 0)}</span>
          </div>
          {otherFees.map((fee) => (
            <div key={fee.id} className="flex justify-between text-sm">
              <span>{fee.name || 'Biaya Tambahan'}:</span>
              <span>{formatRupiah(parseFloat(fee.amount) || 0)}</span>
            </div>
          ))}
          {parseFloat(discount) > 0 && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Diskon:</span>
              <span>-{formatRupiah(parseFloat(discount) || 0)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-primary/30">
            <span className="font-semibold text-lg">Total Harga:</span>
            <span className="font-bold text-2xl text-primary">
              {formatRupiah(calculateTotal())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
