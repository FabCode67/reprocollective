// src/app/admin/spotlight-management/page.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Loader2, Plus, Trash, MoveUp, MoveDown, Image } from "lucide-react";
import RootLayout from "@/components/layouts/Dashboardlayout";

// Types
interface Spotlight {
  id: string;
  title: string;
  description: string;
  image: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function SpotlightManagementPage() {
  const [loading, setLoading] = useState(false);
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [spotlightDialog, setSpotlightDialog] = useState(false);
  const [currentSpotlight, setCurrentSpotlight] = useState<Partial<Spotlight>>({
    title: "",
    description: "",
    image: null,
    isActive: true,
    order: 0
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch spotlights on load
  useEffect(() => {
    fetchSpotlights();
  }, []);

  // Fetch all spotlights
  const fetchSpotlights = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spotlights`);
      const data = await response.json();
      setSpotlights(data.spotlights);
    } catch (error) {
      console.error('Error fetching spotlights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form state
  const resetForm = () => {
    setCurrentSpotlight({
      title: "",
      description: "",
      image: null,
      isActive: true,
      order: 0
    });
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle dialog close
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetForm();
    }
    setSpotlightDialog(open);
  };

  // Handle edit spotlight
  const editSpotlight = (spotlight: Spotlight) => {
    setCurrentSpotlight(spotlight);
    setPreviewImage(spotlight.image);
    setSpotlightDialog(true);
  };

  // Handle spotlight form submission
  const handleSpotlightSubmit = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('title', currentSpotlight.title || '');
      formData.append('description', currentSpotlight.description || '');
      
      if (currentSpotlight.isActive !== undefined) {
        formData.append('isActive', String(currentSpotlight.isActive));
      }
      
      if (currentSpotlight.order !== undefined) {
        formData.append('order', String(currentSpotlight.order));
      }

      // Add image if a new one was selected
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      const method = currentSpotlight.id ? 'PUT' : 'POST';
      const url = currentSpotlight.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/spotlights/${currentSpotlight.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/spotlights`;

      const response = await fetch(url, {
        method,
        body: formData,
        // No Content-Type header needed as it's set automatically for FormData
      });

      if (response.ok) {
        setSpotlightDialog(false);
        resetForm();
        fetchSpotlights(); // Refresh spotlights list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${currentSpotlight.id ? 'update' : 'create'} spotlight`);
      }
    } catch (error) {
      console.error('Error submitting spotlight:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete spotlight
  const deleteSpotlight = async (id: string) => {
    if (!confirm("Are you sure you want to delete this spotlight?")) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spotlights/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchSpotlights(); // Refresh spotlights list
      } else {
        throw new Error('Failed to delete spotlight');
      }
    } catch (error) {
      console.error('Error deleting spotlight:', error);
      alert('Failed to delete spotlight');
    } finally {
      setLoading(false);
    }
  };

  // Move spotlight up in order
  const moveSpotlightUp = async (index: number) => {
    if (index <= 0) return;
    
    try {
      const newSpotlights = [...spotlights];
      const temp = newSpotlights[index];
      newSpotlights[index] = newSpotlights[index - 1];
      newSpotlights[index - 1] = temp;
      
      // Update orders
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spotlights/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newSpotlights.map(s => s.id) }),
      });

      if (response.ok) {
        fetchSpotlights(); // Refresh spotlights list
      } else {
        throw new Error('Failed to reorder spotlights');
      }
    } catch (error) {
      console.error('Error reordering spotlights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Move spotlight down in order
  const moveSpotlightDown = async (index: number) => {
    if (index >= spotlights.length - 1) return;
    
    try {
      const newSpotlights = [...spotlights];
      const temp = newSpotlights[index];
      newSpotlights[index] = newSpotlights[index + 1];
      newSpotlights[index + 1] = temp;
      
      // Update orders
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spotlights/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newSpotlights.map(s => s.id) }),
      });

      if (response.ok) {
        fetchSpotlights(); // Refresh spotlights list
      } else {
        throw new Error('Failed to reorder spotlights');
      }
    } catch (error) {
      console.error('Error reordering spotlights:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle spotlight active status
  const toggleSpotlightActive = async (spotlight: Spotlight) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spotlights/${spotlight.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !spotlight.isActive }),
      });

      if (response.ok) {
        fetchSpotlights(); // Refresh spotlights list
      } else {
        throw new Error('Failed to update spotlight status');
      }
    } catch (error) {
      console.error('Error updating spotlight status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Spotlight Management</h1>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Spotlights</CardTitle>
              <CardDescription>
                Manage featured spotlights displayed on your website.
              </CardDescription>
            </div>
            <Dialog open={spotlightDialog} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Spotlight
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{currentSpotlight.id ? "Edit Spotlight" : "Add New Spotlight"}</DialogTitle>
                  <DialogDescription>
                    Fill in the details for this spotlight.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="spotlight-title">Title *</Label>
                    <Input
                      id="spotlight-title"
                      value={currentSpotlight.title || ""}
                      onChange={(e) => setCurrentSpotlight({ ...currentSpotlight, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spotlight-description">Description *</Label>
                    <Textarea
                      id="spotlight-description"
                      value={currentSpotlight.description || ""}
                      onChange={(e) => setCurrentSpotlight({ ...currentSpotlight, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spotlight-image">Image {!currentSpotlight.id && '*'}</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="spotlight-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                        required={!currentSpotlight.id}
                      />
                    </div>
                    {previewImage && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-500 mb-1">Preview:</p>
                        <img 
                          src={previewImage} 
                          alt="Preview" 
                          className="h-40 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="spotlight-active"
                      checked={currentSpotlight.isActive}
                      onCheckedChange={(checked:boolean) => setCurrentSpotlight({ ...currentSpotlight, isActive: checked })}
                    />
                    <Label htmlFor="spotlight-active">Active</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => handleDialogClose(false)}>Cancel</Button>
                  <Button
                    onClick={handleSpotlightSubmit}
                    disabled={
                      !currentSpotlight.title || 
                      !currentSpotlight.description || 
                      (!currentSpotlight.id && !fileInputRef.current?.files?.length) || 
                      loading
                    }
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {currentSpotlight.id ? "Update Spotlight" : "Add Spotlight"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {loading && <div className="flex justify-center py-6"><Loader2 className="animate-spin" /></div>}

            {spotlights.length === 0 && !loading ? (
              <Alert>
                <AlertDescription>No spotlights found. Add your first spotlight to get started.</AlertDescription>
              </Alert>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spotlights.map((spotlight, index) => (
                    <TableRow key={spotlight.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{spotlight.order + 1}</span>
                          <div className="flex flex-col">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-0 h-6" 
                              onClick={() => moveSpotlightUp(index)}
                              disabled={index === 0}
                            >
                              <MoveUp className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="p-0 h-6" 
                              onClick={() => moveSpotlightDown(index)}
                              disabled={index === spotlights.length - 1}
                            >
                              <MoveDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {spotlight.image ? (
                          <div className="h-16 w-24 relative overflow-hidden rounded border">
                            <img 
                              src={spotlight.image} 
                              alt={spotlight.title} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-24 flex items-center justify-center bg-gray-100 rounded">
                            <Image className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{spotlight.title}</TableCell>
                      <TableCell>{spotlight.description ? (
                        spotlight.description.length > 50
                          ? `${spotlight.description.substring(0, 50)}...`
                          : spotlight.description
                      ) : "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch
                            checked={spotlight.isActive}
                            onCheckedChange={() => toggleSpotlightActive(spotlight)}
                            disabled={loading}
                          />
                          <span className="ml-2">{spotlight.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editSpotlight(spotlight)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteSpotlight(spotlight.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}