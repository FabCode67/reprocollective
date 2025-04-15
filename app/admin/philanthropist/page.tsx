// src/app/admin/philanthropist-management/page.tsx
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
import { 
  Loader2, 
  Plus, 
  Trash, 
  MoveUp, 
  MoveDown, 
  User, 
  Edit, 
  Eye, 
  EyeOff, 
  ImageIcon, 
  ChevronUp, 
  ChevronDown, 
  MoreHorizontal 
} from "lucide-react";
import RootLayout from "@/components/layouts/Dashboardlayout";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface Philanthropist {
  id: string;
  name: string;
  biography: string;
  contribution: string | null;
  contactInfo: string | null;
  image: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function PhilanthropistManagementPage() {
  const [loading, setLoading] = useState(false);
  const [philanthropists, setPhilanthropists] = useState<Philanthropist[]>([]);
  const [philanthropistDialog, setPhilanthropistDialog] = useState(false);
  const [currentPhilanthropist, setCurrentPhilanthropist] = useState<Partial<Philanthropist>>({
    name: "",
    biography: "",
    contribution: "",
    contactInfo: "",
    image: null,
    isActive: true,
    order: 0
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedBio, setExpandedBio] = useState<string | null>(null);

  // Fetch philanthropists on load
  useEffect(() => {
    fetchPhilanthropists();
  }, []);

  // Fetch all philanthropists
  const fetchPhilanthropists = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/philanthropists`);
      const data = await response.json();
      setPhilanthropists(data.philanthropists);
    } catch (error) {
      console.error('Error fetching philanthropists:', error);
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
    setCurrentPhilanthropist({
      name: "",
      biography: "",
      contribution: "",
      contactInfo: "",
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
    setPhilanthropistDialog(open);
  };

  // Handle edit philanthropist
  const editPhilanthropist = (philanthropist: Philanthropist) => {
    setCurrentPhilanthropist(philanthropist);
    setPreviewImage(philanthropist.image);
    setPhilanthropistDialog(true);
  };

  // Handle philanthropist form submission
  const handlePhilanthropistSubmit = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('name', currentPhilanthropist.name || '');
      formData.append('biography', currentPhilanthropist.biography || '');
      
      if (currentPhilanthropist.contribution) {
        formData.append('contribution', currentPhilanthropist.contribution);
      }
      
      if (currentPhilanthropist.contactInfo) {
        formData.append('contactInfo', currentPhilanthropist.contactInfo);
      }
      
      if (currentPhilanthropist.isActive !== undefined) {
        formData.append('isActive', String(currentPhilanthropist.isActive));
      }
      
      if (currentPhilanthropist.order !== undefined) {
        formData.append('order', String(currentPhilanthropist.order));
      }

      // Add image if a new one was selected
      if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
        formData.append('image', fileInputRef.current.files[0]);
      }

      const method = currentPhilanthropist.id ? 'PUT' : 'POST';
      const url = currentPhilanthropist.id
        ? `${process.env.NEXT_PUBLIC_API_URL}/philanthropists/${currentPhilanthropist.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/philanthropists`;

      const response = await fetch(url, {
        method,
        body: formData,
        // No Content-Type header needed as it's set automatically for FormData
      });

      if (response.ok) {
        setPhilanthropistDialog(false);
        resetForm();
        fetchPhilanthropists(); // Refresh philanthropists list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${currentPhilanthropist.id ? 'update' : 'create'} philanthropist`);
      }
    } catch (error) {
      console.error('Error submitting philanthropist:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete philanthropist
  const deletePhilanthropist = async (id: string) => {
    if (!confirm("Are you sure you want to delete this philanthropist?")) return;

    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/philanthropists/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPhilanthropists(); // Refresh philanthropists list
      } else {
        throw new Error('Failed to delete philanthropist');
      }
    } catch (error) {
      console.error('Error deleting philanthropist:', error);
      alert('Failed to delete philanthropist');
    } finally {
      setLoading(false);
    }
  };

  // Move philanthropist up in order
  const movePhilanthropistUp = async (index: number) => {
    if (index <= 0) return;
    
    try {
      const newPhilanthropists = [...philanthropists];
      const temp = newPhilanthropists[index];
      newPhilanthropists[index] = newPhilanthropists[index - 1];
      newPhilanthropists[index - 1] = temp;
      
      // Update orders
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/philanthropists/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newPhilanthropists.map(p => p.id) }),
      });

      if (response.ok) {
        fetchPhilanthropists(); // Refresh philanthropists list
      } else {
        throw new Error('Failed to reorder philanthropists');
      }
    } catch (error) {
      console.error('Error reordering philanthropists:', error);
    } finally {
      setLoading(false);
    }
  };

  // Move philanthropist down in order
  const movePhilanthropistDown = async (index: number) => {
    if (index >= philanthropists.length - 1) return;
    
    try {
      const newPhilanthropists = [...philanthropists];
      const temp = newPhilanthropists[index];
      newPhilanthropists[index] = newPhilanthropists[index + 1];
      newPhilanthropists[index + 1] = temp;
      
      // Update orders
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/philanthropists/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newPhilanthropists.map(p => p.id) }),
      });

      if (response.ok) {
        fetchPhilanthropists(); // Refresh philanthropists list
      } else {
        throw new Error('Failed to reorder philanthropists');
      }
    } catch (error) {
      console.error('Error reordering philanthropists:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle philanthropist active status
  const togglePhilanthropistActive = async (philanthropist: Philanthropist) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/philanthropists/${philanthropist.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !philanthropist.isActive }),
      });

      if (response.ok) {
        fetchPhilanthropists(); // Refresh philanthropists list
      } else {
        throw new Error('Failed to update philanthropist status');
      }
    } catch (error) {
      console.error('Error updating philanthropist status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle biography expansion
  const toggleBioExpansion = (id: string) => {
    setExpandedBio(expandedBio === id ? null : id);
  };

  // Truncate text for display
  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Render the card view for mobile
  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {philanthropists.map((philanthropist, index) => (
          <Card key={philanthropist.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {philanthropist.image ? (
                      <img 
                        src={philanthropist.image} 
                        alt={philanthropist.name} 
                        className="h-12 w-12 object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{philanthropist.name}</h3>
                      <div className="flex items-center gap-1">
                        <Badge className="text-xs">
                          {philanthropist.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <span className="text-xs text-gray-500">Order: {philanthropist.order + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => editPhilanthropist(philanthropist)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => togglePhilanthropistActive(philanthropist)}
                      >
                        {philanthropist.isActive ? (
                          <>
                            <EyeOff className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => movePhilanthropistUp(index)}
                        disabled={index === 0}
                        className="text-blue-600"
                      >
                        <ChevronUp className="mr-2 h-4 w-4" />
                        Move Up
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => movePhilanthropistDown(index)}
                        disabled={index === philanthropists.length - 1}
                        className="text-blue-600"
                      >
                        <ChevronDown className="mr-2 h-4 w-4" />
                        Move Down
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => deletePhilanthropist(philanthropist.id)}
                        className="text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="mt-3">
                  <div className="text-sm font-medium text-gray-500 mb-1">Biography:</div>
                  <div className="text-sm">
                    {expandedBio === philanthropist.id 
                      ? philanthropist.biography 
                      : truncateText(philanthropist.biography, 120)}
                  </div>
                  {philanthropist.biography.length > 120 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-0 h-6 text-[#F77665] mt-1" 
                      onClick={() => toggleBioExpansion(philanthropist.id)}
                    >
                      {expandedBio === philanthropist.id ? "Show less" : "Read more"}
                    </Button>
                  )}
                </div>
                
                {philanthropist.contribution && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-500 mb-1">Contribution:</div>
                    <div className="text-sm">{truncateText(philanthropist.contribution, 80)}</div>
                  </div>
                )}
                
                {philanthropist.contactInfo && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-500 mb-1">Contact:</div>
                    <div className="text-sm">{philanthropist.contactInfo}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Render the table view for desktop
  const renderTableView = () => {
    return (
      <div className="hidden md:block overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order</TableHead>
              <TableHead className="w-[80px]">Photo</TableHead>
              <TableHead className="w-[180px]">Name</TableHead>
              <TableHead>Biography</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {philanthropists.map((philanthropist, index) => (
              <TableRow key={philanthropist.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{philanthropist.order + 1}</span>
                    <div className="flex flex-col">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-6" 
                        onClick={() => movePhilanthropistUp(index)}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-6" 
                        onClick={() => movePhilanthropistDown(index)}
                        disabled={index === philanthropists.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {philanthropist.image ? (
                    <img 
                      src={philanthropist.image} 
                      alt={philanthropist.name} 
                      className="h-12 w-12 object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium">{philanthropist.name}</TableCell>
                <TableCell className="max-w-md">
                  <div className="line-clamp-2">{philanthropist.biography}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={philanthropist.isActive}
                      onCheckedChange={() => togglePhilanthropistActive(philanthropist)}
                      className="scale-75 data-[state=checked]:bg-[#F77665]"
                    />
                    <span className="text-sm">
                      {philanthropist.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => editPhilanthropist(philanthropist)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => deletePhilanthropist(philanthropist.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <RootLayout>
      <div className="container max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Local Philanthropists Management</h1>
          <Dialog open={philanthropistDialog} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button className="self-start sm:self-auto bg-[#F77665] hover:bg-[#F77665]/90">
                <Plus className="mr-2 h-4 w-4" /> Add Philanthropist
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentPhilanthropist.id ? "Edit Philanthropist" : "Add New Philanthropist"}</DialogTitle>
                <DialogDescription>
                  Fill in the details for this local philanthropist.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="philanthropist-name">Name *</Label>
                  <Input
                    id="philanthropist-name"
                    value={currentPhilanthropist.name || ""}
                    onChange={(e) => setCurrentPhilanthropist({ ...currentPhilanthropist, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="philanthropist-biography">Biography *</Label>
                  <Textarea
                    id="philanthropist-biography"
                    value={currentPhilanthropist.biography || ""}
                    onChange={(e) => setCurrentPhilanthropist({ ...currentPhilanthropist, biography: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="philanthropist-contribution">Contribution</Label>
                  <Textarea
                    id="philanthropist-contribution"
                    value={currentPhilanthropist.contribution || ""}
                    onChange={(e) => setCurrentPhilanthropist({ ...currentPhilanthropist, contribution: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="philanthropist-contact">Contact Information</Label>
                  <Input
                    id="philanthropist-contact"
                    value={currentPhilanthropist.contactInfo || ""}
                    onChange={(e) => setCurrentPhilanthropist({ ...currentPhilanthropist, contactInfo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="philanthropist-image">Profile Image {!currentPhilanthropist.id && '*'}</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input
                      id="philanthropist-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      required={!currentPhilanthropist.id}
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

                <div className="flex items-center gap-2">
                  <Switch
                    id="philanthropist-active"
                    checked={currentPhilanthropist.isActive}
                    onCheckedChange={(checked) => setCurrentPhilanthropist({ ...currentPhilanthropist, isActive: checked })}
                    className="scale-75 data-[state=checked]:bg-[#F77665]"
                  />
                  <Label htmlFor="philanthropist-active">Active</Label>
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleDialogClose(false)}
                  className="w-full sm:w-auto order-2 sm:order-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePhilanthropistSubmit}
                  disabled={
                    !currentPhilanthropist.name || 
                    !currentPhilanthropist.biography || 
                    (!currentPhilanthropist.id && !fileInputRef.current?.files?.length) || 
                    loading
                  }
                  className="w-full sm:w-auto order-1 sm:order-2 bg-[#F77665] hover:bg-[#F77665]/90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {currentPhilanthropist.id ? "Update Philanthropist" : "Add Philanthropist"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Philanthropists</CardTitle>
            <CardDescription>
              Manage local philanthropists profiles displayed on your website.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loading && (
              <div className="flex justify-center py-6">
                <Loader2 className="animate-spin h-8 w-8 text-[#F77665]" />
              </div>
            )}

            {philanthropists.length === 0 && !loading ? (
              <Alert className="bg-[#F77665]/10 border-[#F77665]/20">
                <AlertDescription>
                  No philanthropists found. Add your first philanthropist profile to get started.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                {/* Card view for mobile */}
                {renderCardView()}
                
                {/* Table view for desktop */}
                {renderTableView()}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </RootLayout>
  );
}