'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

export interface OtherFee {
  id: string;
  name: string;
  amount: number;
}

interface DynamicFeesManagerProps {
  fees: OtherFee[];
  onChange: (fees: OtherFee[]) => void;
}

export default function DynamicFeesManager({ fees, onChange }: DynamicFeesManagerProps) {
  const [newFeeName, setNewFeeName] = useState('');
  const [newFeeAmount, setNewFeeAmount] = useState('');

  const handleAddFee = () => {
    if (!newFeeName.trim() || !newFeeAmount) {
      return;
    }

    const newFee: OtherFee = {
      id: Date.now().toString(),
      name: newFeeName.trim(),
      amount: parseFloat(newFeeAmount),
    };

    onChange([...fees, newFee]);
    setNewFeeName('');
    setNewFeeAmount('');
  };

  const handleRemoveFee = (id: string) => {
    onChange(fees.filter(fee => fee.id !== id));
  };

  const handleUpdateFee = (id: string, field: 'name' | 'amount', value: string) => {
    onChange(
      fees.map(fee => {
        if (fee.id === id) {
          if (field === 'name') {
            return { ...fee, name: value };
          } else {
            return { ...fee, amount: parseFloat(value) || 0 };
          }
        }
        return fee;
      })
    );
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Rincian Biaya (Dinamis)</Label>
        <span className="text-sm text-muted-foreground">
          Total: {formatRupiah(fees.reduce((sum, fee) => sum + fee.amount, 0))}
        </span>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Tambahkan semua biaya penerbangan seperti: Base Fare, Tax, Service Fee, Baggage, WiFi, Meals, Insurance, dll.
      </p>

      {/* Existing Fees */}
      {fees.length > 0 && (
        <div className="space-y-2">
          {fees.map((fee) => (
            <Card key={fee.id} className="p-3">
              <div className="flex items-center gap-2">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nama Biaya</Label>
                    <Input
                      type="text"
                      value={fee.name}
                      onChange={(e) => handleUpdateFee(fee.id, 'name', e.target.value)}
                      placeholder="Contoh: Base Fare, Tax, WiFi"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Jumlah (Rp)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={fee.amount}
                      onChange={(e) => handleUpdateFee(fee.id, 'amount', e.target.value)}
                      placeholder="0"
                      className="h-9"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFee(fee.id)}
                  className="mt-5 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Fee Form */}
      <Card className="p-3 bg-muted/30">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs">Nama Biaya Baru</Label>
              <Input
                type="text"
                value={newFeeName}
                onChange={(e) => setNewFeeName(e.target.value)}
                placeholder="Contoh: Base Fare, Service Fee"
                className="h-9"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFee();
                  }
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Jumlah (Rp)</Label>
              <Input
                type="number"
                min="0"
                value={newFeeAmount}
                onChange={(e) => setNewFeeAmount(e.target.value)}
                placeholder="0"
                className="h-9"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFee();
                  }
                }}
              />
            </div>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddFee}
            className="w-full"
            disabled={!newFeeName.trim() || !newFeeAmount}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Biaya
          </Button>
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        💡 <strong>Tips:</strong> Tambahkan semua komponen biaya secara terpisah untuk transparansi penuh. 
        Contoh: Base Fare, Tax, Service Fee, Airport Fee, Fuel Surcharge, Baggage, WiFi, Meals, Insurance, Priority Boarding, dll.
      </p>
    </div>
  );
}
