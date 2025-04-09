import React, { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AddLocationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (data: { id: string; name: string; amount: number; count: number; status: string }) => void;
    }

interface FormData {
    name: string;
    location: string;
    phone: string;
}

const AddLocationDialog: React.FC<AddLocationDialogProps> = ({ isOpen, onClose, onSuccess }) => {

  const [isLoading, setIsLoading] = useState(false);
 
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/locations`
        , formData);
        toast.success('Location added successfully', {
            description: 'The new location has been added successfully.',
        });
     

      
      // Reset form
      setFormData({
        name: '',
        location: '',
        phone: '',
      });
      
      // Close dialog and refresh data
      if (onSuccess) onSuccess(response.data);
      onClose();
      
    } catch (error) {
      console.error('Error adding location:', error);
      
        toast.error('Failed to add location', {
            description: (axios.isAxiosError(error) && error.response?.data?.error) || 'An error occurred while adding the location.',
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Donation Location</DialogTitle>
          <DialogDescription>
            Add a new location where donors can make contributions
          </DialogDescription>
          <Button
            variant="ghost"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Location Name
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Kingfisher Restaurant"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Address
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="e.g. Muhima, Kigali"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? "border-red-500" : ""}
            />
            {errors.location && (
              <p className="text-xs text-red-500 mt-1">{errors.location}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Contact Phone
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="e.g. 77888888"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-orange-600 hover:bg-orange-700"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Location'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLocationDialog;