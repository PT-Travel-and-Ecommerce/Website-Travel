"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, X } from "lucide-react";
import Image from "next/image";
import { City } from "@/types";

export default function CitiesPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response = await fetch('/api/cities');
      if (!response.ok) throw new Error('Failed to load cities');
      const data = await response.json();
      setCities(data || []);
    } catch (error) {
      console.error("Error loading cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCity) {
        // Update existing city
        if (file) {
          const fd = new FormData();
          fd.append('name', formData.name);
          fd.append('description', formData.description);
          fd.append('image', file);
          const response = await fetch(`/api/cities/${editingCity.id}`, {
            method: 'PUT',
            body: fd,
          });
          if (!response.ok) throw new Error('Failed to update city');
        } else {
          const payload = { ...formData };
          const response = await fetch(`/api/cities/${editingCity.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error('Failed to update city');
        }
      } else {
        // Create new city
        if (file) {
          const fd = new FormData();
          fd.append('name', formData.name);
          fd.append('description', formData.description);
          fd.append('image', file);
          const response = await fetch('/api/cities', {
            method: 'POST',
            body: fd,
          });
          if (!response.ok) throw new Error('Failed to create city');
        } else {
          const response = await fetch('/api/cities', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
          });
          if (!response.ok) throw new Error('Failed to create city');
        }
      }

      resetForm();
      loadCities();
    } catch (error) {
      console.error("Error saving city:", error);
      alert("Failed to save city");
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      description: city.description,
      imageUrl: city.imageUrl,
    });
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;

    try {
      const response = await fetch(`/api/cities/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete city');
      loadCities();
    } catch (error) {
      console.error("Error deleting city:", error);
      alert("Failed to delete city");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", imageUrl: "" });
    setFile(null);
    setEditingCity(null);
    setShowForm(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Cities</h1>
        <Button onClick={() => setShowForm(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add City
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingCity ? "Edit City" : "Add New City"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">City Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Jakarta"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="City description"
                  rows={3}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Image URL (optional)</label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                />
                <div className="mt-3">
                  <label className="mb-2 block text-sm font-medium">Or Upload Image</label>
                  <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  {file && (
                    <p className="mt-1 text-xs text-gray-500">Selected: {file.name}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingCity ? "Update City" : "Add City"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <Card key={city.id}>
            <CardContent className="p-4">
              {city.imageUrl && (
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                  <Image
                    src={city.imageUrl}
                    alt={city.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="mb-2 text-xl font-bold">{city.name}</h3>
              <p className="mb-4 text-sm text-gray-600">{city.description}</p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(city)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(city.id)}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {cities.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No cities found. Add your first city to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
