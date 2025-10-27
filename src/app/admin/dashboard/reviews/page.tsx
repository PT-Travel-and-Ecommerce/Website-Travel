"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, X, Star } from "lucide-react";
import Image from "next/image";
import { CustomerReview } from "@/types";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [formData, setFormData] = useState({
    customerName: "",
    rating: "5",
    comment: "",
    imageUrl: "",
    location: "",
    isActive: true,
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (!response.ok) throw new Error('Failed to load reviews');
      const data = await response.json();
      setReviews(data || []);
    } catch (error) {
      console.error("Error loading reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingReview) {
        if (file) {
          const fd = new FormData();
          fd.append('customerName', formData.customerName);
          fd.append('rating', String(parseInt(formData.rating)));
          fd.append('comment', formData.comment);
          fd.append('location', formData.location);
          fd.append('isActive', String(formData.isActive));
          fd.append('image', file);
          const response = await fetch(`/api/reviews/${editingReview.id}`, { method: 'PUT', body: fd });
          if (!response.ok) throw new Error('Failed to update review');
        } else {
          const payload = {
            customerName: formData.customerName,
            rating: parseInt(formData.rating),
            comment: formData.comment,
            imageUrl: formData.imageUrl || undefined,
            location: formData.location || undefined,
            isActive: formData.isActive,
          };
          const response = await fetch(`/api/reviews/${editingReview.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error('Failed to update review');
        }
      } else {
        if (file) {
          const fd = new FormData();
          fd.append('customerName', formData.customerName);
          fd.append('rating', String(parseInt(formData.rating)));
          fd.append('comment', formData.comment);
          fd.append('location', formData.location);
          fd.append('isActive', String(formData.isActive));
          fd.append('image', file);
          const response = await fetch('/api/reviews', { method: 'POST', body: fd });
          if (!response.ok) throw new Error('Failed to create review');
        } else {
          const payload = {
            customerName: formData.customerName,
            rating: parseInt(formData.rating),
            comment: formData.comment,
            imageUrl: formData.imageUrl || undefined,
            location: formData.location || undefined,
            isActive: formData.isActive,
          };
          const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
          if (!response.ok) throw new Error('Failed to create review');
        }
      }

      resetForm();
      loadReviews();
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review");
    }
  };

  const handleEdit = (review: CustomerReview) => {
    setEditingReview(review);
    setFormData({
      customerName: review.customerName,
      rating: review.rating.toString(),
      comment: review.comment,
      imageUrl: review.imageUrl || "",
      location: review.location || "",
      isActive: review.isActive,
    });
    setFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const response = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete review');
      loadReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review");
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: "",
      rating: "5",
      comment: "",
      imageUrl: "",
      location: "",
      isActive: true,
    });
    setFile(null);
    setEditingReview(null);
    setShowForm(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customer Reviews Management</h1>
          <p className="text-muted-foreground">Manage customer reviews and testimonials</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingReview ? "Edit Review" : "Add New Review"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Customer Name</label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Rating (1-5)</label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location (Optional)</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York, USA"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Customer Image URL (Optional)</label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                  />
                  <div className="mt-3">
                    <label className="text-sm font-medium">Or Upload Image</label>
                    <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                    {file && (
                      <p className="mt-1 text-xs text-gray-500">Selected: {file.name}</p>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Review Comment</label>
                  <Textarea
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    rows={4}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">
                  {editingReview ? "Update" : "Create"} Review
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.imageUrl && (
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={review.imageUrl}
                        alt={review.customerName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold">{review.customerName}</h3>
                    {review.location && (
                      <p className="text-xs text-muted-foreground">{review.location}</p>
                    )}
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${review.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                  {review.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div>{renderStars(review.rating)}</div>
              <p className="text-sm line-clamp-3">{review.comment}</p>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(review)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(review.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No reviews found. Add your first review to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
