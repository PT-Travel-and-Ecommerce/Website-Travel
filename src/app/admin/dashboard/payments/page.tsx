'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatRupiah } from '@/lib/format';
import { Upload, Check, X, Clock, Trash2, Eye, Edit } from 'lucide-react';

interface Payment {
  id: string;
  userEmail: string;
  userName: string;
  amount: string;
  status: string;
  paymentProof: string | null;
  createdAt: string;
  updatedAt: string;
  flightRoute: {
    airline: string;
    departureCity: { name: string };
    arrivalCity: { name: string };
    departureDate: string;
  };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      const data = await response.json();
      
      // Check if response is an error object
      if (data.error) {
        toast.error(data.error === 'Unauthorized' ? 'Tidak terotorisasi' : 'Gagal memuat data pembayaran');
        setPayments([]);
        return;
      }
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setPayments(data);
      } else {
        console.error('Unexpected data format:', data);
        toast.error('Format data tidak valid');
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Gagal memuat data pembayaran');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (paymentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success('Status pembayaran berhasil diupdate');
        fetchPayments();
        setIsModalOpen(false);
      } else {
        toast.error('Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Terjadi kesalahan');
    }
  };

  const handleUploadProof = async (paymentId: string, file: File) => {
    try {
      setUploadingProof(true);
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = uploadData.url;

      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentProof: imageUrl }),
      });

      if (response.ok) {
        toast.success('Bukti pembayaran berhasil diupload');
        fetchPayments();
        if (selectedPayment?.id === paymentId) {
          setSelectedPayment({ ...selectedPayment, paymentProof: imageUrl });
        }
      } else {
        toast.error('Gagal menyimpan bukti pembayaran');
      }
    } catch (error) {
      console.error('Error uploading proof:', error);
      toast.error('Gagal upload bukti pembayaran');
    } finally {
      setUploadingProof(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedPayment) {
      handleUploadProof(selectedPayment.id, file);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm('Yakin ingin menghapus pembayaran ini?')) return;

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Pembayaran berhasil dihapus');
        fetchPayments();
        setIsModalOpen(false);
      } else {
        toast.error('Gagal menghapus pembayaran');
      }
    } catch (error) {
      console.error('Error deleting payment:', error);
      toast.error('Terjadi kesalahan');
    }
  };

  const openPaymentModal = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      pending: { 
        label: 'Pending', 
        className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        icon: Clock 
      },
      paid: { 
        label: 'Lunas', 
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        icon: Check 
      },
      cancelled: { 
        label: 'Dibatalkan', 
        className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        icon: X 
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const filteredPayments = payments.filter((payment) => {
    if (filterStatus === 'all') return true;
    return payment.status === filterStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Pembayaran</h1>
          <p className="text-muted-foreground mt-1">
            Kelola status pembayaran dan bukti transfer
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Filter Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Lunas</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchPayments}>
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{payment.userName}</h3>
                    {getStatusBadge(payment.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{payment.userEmail}</p>
                  <p className="text-sm">
                    <span className="font-medium">Rute:</span>{' '}
                    {payment.flightRoute.departureCity.name} → {payment.flightRoute.arrivalCity.name} •{' '}
                    {payment.flightRoute.airline}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Keberangkatan:</span>{' '}
                    {new Date(payment.flightRoute.departureDate).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="text-2xl font-bold text-primary mt-2">
                    {formatRupiah(Number(payment.amount))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Dibuat: {new Date(payment.createdAt).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => openPaymentModal(payment)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Kelola
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPayments.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              {filterStatus === 'all' 
                ? 'Belum ada data pembayaran' 
                : `Tidak ada pembayaran dengan status ${filterStatus === 'pending' ? 'pending' : filterStatus === 'paid' ? 'lunas' : 'dibatalkan'}`}
            </CardContent>
          </Card>
        )}
      </div>

      {selectedPayment && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Kelola Pembayaran</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Informasi Pembayaran */}
              <div>
                <h3 className="text-lg font-semibold mb-3 pb-2 border-b">Informasi Pembayaran</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Nama</Label>
                    <p className="font-medium">{selectedPayment.userName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedPayment.userEmail}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Rute</Label>
                    <p className="font-medium">
                      {selectedPayment.flightRoute.departureCity.name} →{' '}
                      {selectedPayment.flightRoute.arrivalCity.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Maskapai</Label>
                    <p className="font-medium">{selectedPayment.flightRoute.airline}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Total Pembayaran</Label>
                    <p className="text-2xl font-bold text-primary">
                      {formatRupiah(Number(selectedPayment.amount))}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Status Saat Ini</Label>
                    <div className="mt-1">{getStatusBadge(selectedPayment.status)}</div>
                  </div>
                </div>
              </div>

              {/* Update Status */}
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-600" />
                  Update Status Pembayaran
                </h3>
                <div className="space-y-2">
                  <Label>Pilih Status Baru</Label>
                  <Select
                    value={selectedPayment.status}
                    onValueChange={(value) =>
                      handleUpdateStatus(selectedPayment.id, value)
                    }
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Lunas</SelectItem>
                      <SelectItem value="cancelled">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Status akan langsung diupdate setelah Anda memilih
                  </p>
                </div>
              </div>

              {/* Update Bukti Pembayaran */}
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-green-600" />
                  Update Bukti Pembayaran
                </h3>
                <div className="space-y-3">
                  {selectedPayment.paymentProof ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm text-muted-foreground mb-2 block">Bukti Pembayaran Saat Ini</Label>
                        <img
                          src={selectedPayment.paymentProof}
                          alt="Bukti Pembayaran"
                          className="w-full h-64 object-contain border rounded-lg bg-white"
                        />
                      </div>
                      <Button
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => handleFileSelect(e as any);
                          input.click();
                        }}
                        disabled={uploadingProof}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingProof ? 'Mengupload...' : 'Ganti Bukti Pembayaran'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center bg-white dark:bg-gray-900">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-muted-foreground">Belum ada bukti pembayaran</p>
                      </div>
                      <Button
                        variant="default"
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => handleFileSelect(e as any);
                          input.click();
                        }}
                        disabled={uploadingProof}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingProof ? 'Mengupload...' : 'Upload Bukti Pembayaran'}
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Format yang didukung: JPG, PNG, GIF (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="destructive"
                onClick={() => handleDeletePayment(selectedPayment.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Hapus
              </Button>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
