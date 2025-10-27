'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, Check, CreditCard, Building2, Plane } from 'lucide-react';
import { toast } from 'sonner';

interface FlightRoute {
  id: string;
  departureCityId: string;
  arrivalCityId: string;
  departureDate: string;
  returnDate: string | null;
  price: number;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  availableSeats: number;
  departureCity: { id: string; name: string };
  arrivalCity: { id: string; name: string };
}

interface FlightPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  flightRoute: FlightRoute;
}

export default function FlightPaymentModal({ isOpen, onClose, flightRoute }: FlightPaymentModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [bankAccounts, setBankAccounts] = useState<Array<{
    id: string;
    bankName: string;
    accountNumber: string;
    accountName: string;
  }>>([]);
  const [whatsappNumber, setWhatsappNumber] = useState<string>("");
  const [paymentCreated, setPaymentCreated] = useState(false);

  useEffect(() => {
    if (isOpen && !paymentCreated) {
      createPaymentRecord();
    }
  }, [isOpen]);

  useEffect(() => {
    fetch('/api/bank-accounts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBankAccounts(data);
        }
      })
      .catch(error => console.error('Error fetching bank accounts:', error));
  }, []);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.whatsappNumber === 'string') {
          setWhatsappNumber(data.whatsappNumber);
        }
      })
      .catch(error => console.error('Error fetching settings:', error));
  }, []);

  const createPaymentRecord = async () => {
    try {
      const userRes = await fetch('/api/auth/me');
      const userData = await userRes.json();
      
      if (!userData.user) {
        toast.error('Silakan login terlebih dahulu');
        return;
      }

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightRouteId: flightRoute.id,
          userId: userData.user.id,
          userEmail: userData.user.email,
          userName: userData.user.name || userData.user.username || userData.user.email,
          amount: flightRoute.price,
        }),
      });

      if (response.ok) {
        setPaymentCreated(true);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success('Berhasil disalin!');
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Informasi Pembayaran
          </DialogTitle>
          <DialogDescription>
            Transfer ke salah satu rekening di bawah ini dengan nominal yang sesuai
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                <p className="text-4xl font-bold text-primary">{formatPrice(Number(flightRoute.price))}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Plane className="w-4 h-4" />
                  <span>
                    {flightRoute.departureCity.name} → {flightRoute.arrivalCity.name} • {flightRoute.airline}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(flightRoute.departureDate).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Building2 className="w-4 h-4" />
              <span>Pilih Rekening Tujuan:</span>
            </div>

            {bankAccounts.map((account, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">{account.bankName}</span>
                      <span className="text-sm text-muted-foreground">
                        {account.accountName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                      <span className="font-mono font-semibold text-lg">
                        {account.accountNumber}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          handleCopy(account.accountNumber, `${account.bankName}-number`)
                        }
                      >
                        {copiedField === `${account.bankName}-number` ? (
                          <Check className="w-4 h-4" style={{ color: '#dcac56' }} />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {whatsappNumber && (
            <Card className="bg-primary/10 dark:bg-primary/20 border-primary/30 dark:border-primary/50">
              <CardContent className="pt-6">
                <p className="text-sm">
                  Setelah melakukan pembayaran, silakan hubungi kami melalui WhatsApp di nomor{' '}
                  <a
                    className="font-semibold text-primary underline"
                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {whatsappNumber}
                  </a>
                  {' '}untuk konfirmasi pembayaran tiket penerbangan Anda.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="font-semibold">Catatan Penting:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Transfer sesuai dengan nominal yang tertera</li>
                  <li>Simpan bukti transfer untuk konfirmasi</li>
                  <li>Pembayaran akan diverifikasi dalam 1x24 jam</li>
                  <li>Tiket akan dikirimkan setelah pembayaran diverifikasi</li>
                  <li>Hubungi CS kami jika ada kendala</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} className="w-full">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
