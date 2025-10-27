'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowUp, ArrowDown, Star, Upload, Image as ImageIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

interface City {
  id: string;
  name: string;
}

interface FlightRoute {
  id: string;
  airline: string;
  departureCity: City;
  arrivalCity: City;
  totalPrice: number;
  departureDate: string;
  duration: string;
}

interface PopularFlightRoute {
  id: string;
  flightRouteId: string;
  displayOrder: number;
  isActive: boolean;
  imageUrl?: string | null;
  flightRoute: FlightRoute;
}

export default function PopularRoutesPage() {
  const [popularRoutes, setPopularRoutes] = useState<PopularFlightRoute[]>([]);
  const [allRoutes, setAllRoutes] = useState<FlightRoute[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPopularRoutes();
    fetchAllRoutes();
  }, []);

  const fetchPopularRoutes = async () => {
    try {
      const response = await fetch('/api/popular-flight-routes');
      const data = await response.json();
      setPopularRoutes(data);
    } catch (error) {
      console.error('Error fetching popular routes:', error);
      toast.error('Gagal memuat data rute populer');
    }
  };

  const fetchAllRoutes = async () => {
    try {
      const response = await fetch('/api/flight-routes');
      const data = await response.json();
      setAllRoutes(data);
    } catch (error) {
      console.error('Error fetching all routes:', error);
      toast.error('Gagal memuat data rute penerbangan');
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedImage) return null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        toast.error('Gagal upload gambar');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal upload gambar');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedRouteId) {
      toast.error('Pilih rute penerbangan terlebih dahulu');
      return;
    }

    try {
      // Upload image first if selected
      let imageUrl: string | null = null;
      if (selectedImage) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          return; // Stop if image upload failed
        }
      }

      const maxOrder = popularRoutes.length > 0
        ? Math.max(...popularRoutes.map(r => r.displayOrder))
        : -1;

      const response = await fetch('/api/popular-flight-routes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightRouteId: selectedRouteId,
          displayOrder: maxOrder + 1,
          isActive: true,
          imageUrl,
        }),
      });

      if (response.ok) {
        toast.success('Rute berhasil ditambahkan ke populer');
        setIsOpen(false);
        setSelectedRouteId('');
        setSelectedImage(null);
        setImagePreview('');
        fetchPopularRoutes();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Gagal menambahkan rute populer');
      }
    } catch (error) {
      console.error('Error adding popular route:', error);
      toast.error('Gagal menambahkan rute populer');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus rute ini dari populer?')) {
      return;
    }

    try {
      const response = await fetch(`/api/popular-flight-routes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Rute berhasil dihapus dari populer');
        fetchPopularRoutes();
      } else {
        throw new Error('Failed to delete popular route');
      }
    } catch (error) {
      console.error('Error deleting popular route:', error);
      toast.error('Gagal menghapus rute populer');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const route = popularRoutes.find(r => r.id === id);
      if (!route) return;

      const response = await fetch(`/api/popular-flight-routes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayOrder: route.displayOrder,
          isActive: !currentStatus,
        }),
      });

      if (response.ok) {
        toast.success(`Rute ${!currentStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
        fetchPopularRoutes();
      } else {
        throw new Error('Failed to toggle route');
      }
    } catch (error) {
      console.error('Error toggling route:', error);
      toast.error('Gagal mengubah status rute');
    }
  };

  const handleMoveUp = async (id: string, currentOrder: number) => {
    const previousRoute = popularRoutes.find(r => r.displayOrder === currentOrder - 1);
    if (!previousRoute) return;

    try {
      await fetch(`/api/popular-flight-routes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayOrder: currentOrder - 1,
          isActive: popularRoutes.find(r => r.id === id)?.isActive,
        }),
      });

      await fetch(`/api/popular-flight-routes/${previousRoute.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayOrder: currentOrder,
          isActive: previousRoute.isActive,
        }),
      });

      toast.success('Urutan berhasil diubah');
      fetchPopularRoutes();
    } catch (error) {
      console.error('Error moving route:', error);
      toast.error('Gagal mengubah urutan');
    }
  };

  const handleMoveDown = async (id: string, currentOrder: number) => {
    const nextRoute = popularRoutes.find(r => r.displayOrder === currentOrder + 1);
    if (!nextRoute) return;

    try {
      await fetch(`/api/popular-flight-routes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayOrder: currentOrder + 1,
          isActive: popularRoutes.find(r => r.id === id)?.isActive,
        }),
      });

      await fetch(`/api/popular-flight-routes/${nextRoute.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayOrder: currentOrder,
          isActive: nextRoute.isActive,
        }),
      });

      toast.success('Urutan berhasil diubah');
      fetchPopularRoutes();
    } catch (error) {
      console.error('Error moving route:', error);
      toast.error('Gagal mengubah urutan');
    }
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const availableRoutes = allRoutes.filter(
    route => !popularRoutes.some(pr => pr.flightRouteId === route.id)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rute Populer</h1>
          <p className="text-gray-600">Kelola rute penerbangan yang ditampilkan di halaman utama</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Rute Populer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Rute ke Populer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="route">Pilih Rute Penerbangan</Label>
                <Select value={selectedRouteId} onValueChange={setSelectedRouteId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih rute" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoutes.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.departureCity.name} → {route.arrivalCity.name} ({route.airline}) - {formatRupiah(Number(route.totalPrice))}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Upload Gambar Destinasi (Opsional)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                    {imagePreview ? (
                      <div className="relative w-full h-48">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-gray-400" />
                        <div className="text-center">
                          <p className="text-sm font-medium">Klik untuk upload gambar</p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP hingga 5MB</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>
                {imagePreview && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview('');
                    }}
                  >
                    Hapus Gambar
                  </Button>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setIsOpen(false);
                  setSelectedImage(null);
                  setImagePreview('');
                }}>
                  Batal
                </Button>
                <Button onClick={handleAdd} disabled={uploading}>
                  {uploading ? 'Mengupload...' : 'Tambah'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {popularRoutes.map((popularRoute, index) => {
          const route = popularRoute.flightRoute;
          return (
            <Card key={popularRoute.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm font-medium">
                        #{popularRoute.displayOrder + 1}
                      </span>
                      <h3 className="text-xl font-bold">
                        {route.departureCity.name} → {route.arrivalCity.name}
                      </h3>
                      <span className="px-2 py-1 bg-primary/20 rounded text-sm text-primary">
                        {route.airline}
                      </span>
                      {!popularRoute.isActive && (
                        <span className="px-2 py-1 bg-red-100 rounded text-sm text-red-700">
                          Tidak Aktif
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Harga:</span>{' '}
                        {formatRupiah(Number(route.totalPrice))}
                      </div>
                      <div>
                        <span className="font-medium">Durasi:</span> {route.duration}
                      </div>
                      <div>
                        <span className="font-medium">Tanggal:</span>{' '}
                        {new Date(route.departureDate).toLocaleDateString('id-ID')}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`active-${popularRoute.id}`}>Aktif:</Label>
                      <Switch
                        id={`active-${popularRoute.id}`}
                        checked={popularRoute.isActive}
                        onCheckedChange={() => handleToggleActive(popularRoute.id, popularRoute.isActive)}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMoveUp(popularRoute.id, popularRoute.displayOrder)}
                    disabled={index === 0}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMoveDown(popularRoute.id, popularRoute.displayOrder)}
                    disabled={index === popularRoutes.length - 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(popularRoute.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
        {popularRoutes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">Belum ada rute populer. Tambahkan rute untuk ditampilkan di halaman utama.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
