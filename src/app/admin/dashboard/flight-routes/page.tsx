'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
import { toast } from 'sonner';
import { Plane, Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import DynamicFeesManager, { OtherFee } from '@/components/admin/dynamic-fees-manager';
import Image from 'next/image';

interface City {
  id: string;
  name: string;
}

interface FlightRoute {
  id: string;
  departureCityId: string;
  arrivalCityId: string;
  departureDate: string;
  returnDate: string | null;
  airline: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  availableSeats: number;
  flightClass: string;
  imageUrl: string;
  description: string;
  baseFare: number;
  tax: number;
  serviceFee: number;
  baggageFee: number;
  wifiFee: number;
  mealFee: number;
  insuranceFee: number;
  otherFees: OtherFee[];
  discount: number;
  totalPrice: number;
  departureCity: City;
  arrivalCity: City;
}

export default function FlightRoutesPage() {
  const [flightRoutes, setFlightRoutes] = useState<FlightRoute[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<FlightRoute | null>(null);
  const [formData, setFormData] = useState({
    departureCityId: '',
    arrivalCityId: '',
    departureDate: '',
    returnDate: '',
    airline: '',
    departureTime: '',
    arrivalTime: '',
    duration: '',
    rating: '5',
    availableSeats: '0',
    flightClass: 'economy',
    imageUrl: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg',
    description: '',
    discount: '0',
  });
  const [otherFees, setOtherFees] = useState<OtherFee[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFlightRoutes();
    fetchCities();
  }, []);

  const fetchFlightRoutes = async () => {
    try {
      const response = await fetch('/api/flight-routes');
      const data = await response.json();
      setFlightRoutes(data);
    } catch (error) {
      console.error('Error fetching flight routes:', error);
      toast.error('Gagal memuat data rute penerbangan');
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch('/api/cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Gagal memuat data kota');
    }
  };

  const calculateTotalPrice = (fees: OtherFee[], discount: string) => {
    const otherFeesTotal = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const discountAmount = parseFloat(discount) || 0;
    return otherFeesTotal - discountAmount;
  };

  // Calculate duration from departure and arrival time
  const calculateDuration = (departureTime: string, arrivalTime: string): string => {
    if (!departureTime || !arrivalTime) return '';
    
    const [depHour, depMin] = departureTime.split(':').map(Number);
    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
    
    let totalMinutes = (arrHour * 60 + arrMin) - (depHour * 60 + depMin);
    
    // Handle overnight flights (arrival time is next day)
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours}h ${minutes}m`;
  };

  // Extract time from datetime string (format: HH:mm)
  const extractTimeFromDateTime = (datetime: string): string => {
    if (!datetime) return '';
    try {
      const date = new Date(datetime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch {
      return '';
    }
  };

  // Format time to 12-hour format with AM/PM
  const formatTimeToAMPM = (datetime: string): string => {
    if (!datetime) return '';
    try {
      const date = new Date(datetime);
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      
      // Convert 24-hour to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be 12
      
      const minutesStr = minutes.toString().padStart(2, '0');
      return `${hours}:${minutesStr} ${ampm}`;
    } catch {
      return '';
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi tanggal keberangkatan wajib diisi
    if (!formData.departureDate) {
      toast.error('Tanggal keberangkatan wajib diisi!');
      return;
    }

    // Validasi tanggal pulang wajib diisi
    if (!formData.returnDate) {
      toast.error('Tanggal pulang wajib diisi!');
      return;
    }

    // Validasi tanggal pulang harus setelah tanggal keberangkatan
    const departureDate = new Date(formData.departureDate);
    const returnDate = new Date(formData.returnDate);
    if (returnDate <= departureDate) {
      toast.error('Tanggal pulang harus setelah tanggal keberangkatan!');
      return;
    }

    const totalPrice = calculateTotalPrice(otherFees, formData.discount);

    try {
      // Upload image first if selected
      let imageUrl = formData.imageUrl;
      if (selectedImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const url = editingRoute
        ? `/api/flight-routes/${editingRoute.id}`
        : '/api/flight-routes';
      const method = editingRoute ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          baseFare: 0,
          tax: 0,
          serviceFee: 0,
          baggageFee: 0,
          wifiFee: 0,
          mealFee: 0,
          insuranceFee: 0,
          otherFees: otherFees,
          discount: parseFloat(formData.discount),
          totalPrice,
          rating: parseInt(formData.rating),
          availableSeats: parseInt(formData.availableSeats),
          returnDate: formData.returnDate,
        }),
      });

      if (response.ok) {
        toast.success(
          editingRoute
            ? 'Rute penerbangan berhasil diperbarui'
            : 'Rute penerbangan berhasil ditambahkan'
        );
        setIsOpen(false);
        resetForm();
        fetchFlightRoutes();
      } else {
        throw new Error('Failed to save flight route');
      }
    } catch (error) {
      console.error('Error saving flight route:', error);
      toast.error('Gagal menyimpan rute penerbangan');
    }
  };

  const handleEdit = (route: FlightRoute) => {
    setEditingRoute(route);
    
    // Extract time properly from datetime strings
    const depTime = extractTimeFromDateTime(route.departureTime);
    const arrTime = extractTimeFromDateTime(route.arrivalTime);
    
    setFormData({
      departureCityId: route.departureCityId,
      arrivalCityId: route.arrivalCityId,
      departureDate: route.departureDate.split('T')[0],
      returnDate: route.returnDate ? route.returnDate.split('T')[0] : '',
      airline: route.airline,
      departureTime: depTime,
      arrivalTime: arrTime,
      duration: route.duration,
      rating: route.rating.toString(),
      availableSeats: route.availableSeats.toString(),
      flightClass: route.flightClass,
      imageUrl: route.imageUrl,
      description: route.description,
      discount: route.discount.toString(),
    });
    setOtherFees(route.otherFees || []);
    setImagePreview(route.imageUrl);
    setSelectedImage(null);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus rute penerbangan ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/flight-routes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Rute penerbangan berhasil dihapus');
        fetchFlightRoutes();
      } else {
        throw new Error('Failed to delete flight route');
      }
    } catch (error) {
      console.error('Error deleting flight route:', error);
      toast.error('Gagal menghapus rute penerbangan');
    }
  };

  const resetForm = () => {
    setFormData({
      departureCityId: '',
      arrivalCityId: '',
      departureDate: '',
      returnDate: '',
      airline: '',
      departureTime: '',
      arrivalTime: '',
      duration: '',
      rating: '5',
      availableSeats: '0',
      flightClass: 'economy',
      imageUrl: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg',
      description: '',
      discount: '0',
    });
    setOtherFees([]);
    setEditingRoute(null);
    setSelectedImage(null);
    setImagePreview('');
  };

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rute Penerbangan</h1>
          <p className="text-gray-600">Kelola rute penerbangan dengan rincian tarif lengkap</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Rute
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRoute ? 'Edit Rute Penerbangan' : 'Tambah Rute Penerbangan'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informasi Penerbangan</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureCityId">Kota Keberangkatan</Label>
                    <Select
                      value={formData.departureCityId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, departureCityId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kota" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalCityId">Kota Tujuan</Label>
                    <Select
                      value={formData.arrivalCityId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, arrivalCityId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kota" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureDate">
                      Tanggal Keberangkatan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      id="departureDate"
                      value={formData.departureDate}
                      onChange={(e) =>
                        setFormData({ ...formData, departureDate: e.target.value })
                      }
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Wajib diisi untuk pencarian dengan tanggal
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">
                      Tanggal Pulang <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      id="returnDate"
                      value={formData.returnDate}
                      onChange={(e) =>
                        setFormData({ ...formData, returnDate: e.target.value })
                      }
                      min={formData.departureDate}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Wajib diisi dan harus setelah tanggal keberangkatan
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="airline">Maskapai</Label>
                  <Input
                    type="text"
                    id="airline"
                    value={formData.airline}
                    onChange={(e) =>
                      setFormData({ ...formData, airline: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departureTime">Waktu Berangkat</Label>
                    <Input
                      type="time"
                      id="departureTime"
                      value={formData.departureTime}
                      onChange={(e) => {
                        const newDepartureTime = e.target.value;
                        const newDuration = calculateDuration(newDepartureTime, formData.arrivalTime);
                        setFormData({ 
                          ...formData, 
                          departureTime: newDepartureTime,
                          duration: newDuration || formData.duration
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrivalTime">Waktu Tiba</Label>
                    <Input
                      type="time"
                      id="arrivalTime"
                      value={formData.arrivalTime}
                      onChange={(e) => {
                        const newArrivalTime = e.target.value;
                        const newDuration = calculateDuration(formData.departureTime, newArrivalTime);
                        setFormData({ 
                          ...formData, 
                          arrivalTime: newArrivalTime,
                          duration: newDuration || formData.duration
                        });
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durasi (Otomatis)</Label>
                    <Input
                      type="text"
                      id="duration"
                      placeholder="2h 30m"
                      value={formData.duration}
                      readOnly
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      Dikalkulasi otomatis dari waktu berangkat dan tiba
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="flightClass">Kelas Penerbangan</Label>
                    <Select
                      value={formData.flightClass}
                      onValueChange={(value) =>
                        setFormData({ ...formData, flightClass: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-5)</Label>
                    <Input
                      type="number"
                      id="rating"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) =>
                        setFormData({ ...formData, rating: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availableSeats">Kursi Tersedia</Label>
                    <Input
                      type="number"
                      id="availableSeats"
                      min="0"
                      value={formData.availableSeats}
                      onChange={(e) =>
                        setFormData({ ...formData, availableSeats: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi penerbangan..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gambar Penerbangan</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="flight-image-upload"
                    />
                    <label htmlFor="flight-image-upload" className="cursor-pointer">
                      {imagePreview || formData.imageUrl ? (
                        <div className="space-y-2">
                          <div className="relative w-full h-48">
                            <Image
                              src={imagePreview || formData.imageUrl}
                              alt="Flight preview"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('flight-image-upload')?.click();
                              }}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Ganti Gambar
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedImage(null);
                                setImagePreview('');
                                setFormData({ ...formData, imageUrl: '' });
                              }}
                            >
                              <X className="w-4 h-4 mr-2" />
                              Hapus
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 py-8">
                          <Upload className="w-12 h-12 text-gray-400" />
                          <div className="text-center">
                            <p className="text-sm font-medium">Klik untuk upload gambar penerbangan</p>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP hingga 5MB</p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Gambar ini akan ditampilkan di halaman detail penerbangan
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t pt-4">
                <h3 className="font-semibold text-lg">Rincian Tarif</h3>
                
                {/* Dynamic Fees Manager - Semua biaya dikelola di sini */}
                <DynamicFeesManager
                  fees={otherFees}
                  onChange={setOtherFees}
                />

                {/* Discount Section */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="discount">Diskon (Rp)</Label>
                    <Input
                      type="number"
                      id="discount"
                      min="0"
                      value={formData.discount}
                      onChange={(e) =>
                        setFormData({ ...formData, discount: e.target.value })
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Diskon akan mengurangi dari total semua biaya
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border-2 border-primary/30">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Subtotal Biaya:</span>
                      <span>{formatRupiah(otherFees.reduce((sum, fee) => sum + fee.amount, 0))}</span>
                    </div>
                    {parseFloat(formData.discount) > 0 && (
                      <div className="flex justify-between items-center text-sm text-red-600">
                        <span>Diskon:</span>
                        <span>- {formatRupiah(parseFloat(formData.discount))}</span>
                      </div>
                    )}
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-semibold text-lg">Total Harga:</span>
                      <span className="font-bold text-2xl text-primary">
                        {formatRupiah(calculateTotalPrice(otherFees, formData.discount))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  disabled={uploading}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Mengupload...' : editingRoute ? 'Update' : 'Tambah'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {flightRoutes.map((route) => (
          <Card key={route.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="bg-primary/20 p-3 rounded-lg">
                  <Plane className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-bold">
                      {route.departureCity.name} → {route.arrivalCity.name}
                    </h3>
                    <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {route.airline}
                    </span>
                    <span className="px-2 py-1 bg-primary/20 rounded text-sm text-primary">
                      {route.flightClass}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{route.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Berangkat:</span>{' '}
                      {new Date(route.departureDate).toLocaleDateString('id-ID')}
                    </div>
                    {route.returnDate && (
                      <div>
                        <span className="font-medium">Kembali:</span>{' '}
                        {new Date(route.returnDate).toLocaleDateString('id-ID')}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Waktu:</span>{' '}
                      {formatTimeToAMPM(route.departureTime)} - {formatTimeToAMPM(route.arrivalTime)}
                    </div>
                    <div>
                      <span className="font-medium">Durasi:</span> {route.duration}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {route.otherFees && route.otherFees.length > 0 ? (
                      route.otherFees.map((fee) => (
                        <span key={fee.id} className="px-2 py-1 bg-primary/20 rounded text-primary">
                          {fee.name}: {formatRupiah(fee.amount)}
                        </span>
                      ))
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 rounded text-gray-500">
                        Belum ada rincian biaya
                      </span>
                    )}
                    {route.discount > 0 && (
                      <span className="px-2 py-1 bg-red-100 rounded text-red-700">
                        Diskon: -{formatRupiah(route.discount)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="font-bold text-xl text-primary">
                      {formatRupiah(route.totalPrice)}
                    </span>
                    <span>Rating: {route.rating}/5</span>
                    <span>Kursi: {route.availableSeats}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(route)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(route.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {flightRoutes.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-gray-500">Belum ada rute penerbangan</p>
          </Card>
        )}
      </div>
    </div>
  );
}
