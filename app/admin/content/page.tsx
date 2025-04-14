// src/app/admin/content-management/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Loader2, Plus, Save, Trash } from "lucide-react";
import RootLayout from "@/components/layouts/Dashboardlayout";
import { RichTextEditor } from '@/components/ui/rich-text-editor';

// Types
interface Content {
  section: string;
  text: string;
  updatedAt: string;
}

interface Partner {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(false);
  const [, setContentSections] = useState<Content[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({});
  
  // Partner form state
  const [partnerDialog, setPartnerDialog] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partial<Partner>>({
    name: "",
    description: "",
    logoUrl: "",
    websiteUrl: "",
    isActive: true
  });

  // Fetch content and partners on load
  useEffect(() => {
    fetchContent();
    fetchPartners();
  }, []);

  // Fetch all content sections
  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content`);
      const data = await response.json();
      setContentSections(data.contents);
      
      // Initialize editing state
      const initialEditState: { [key: string]: string } = {};
      data.contents.forEach((content: Content) => {
        initialEditState[content.section] = content.text;
      });
      setEditingContent(initialEditState);
    } catch (error) {
      console.error('Error fetching content:', error);
      
    } finally {
      setLoading(false);
    }
  };

  // Fetch all partners
  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/partners`);
      const data = await response.json();
      setPartners(data.partners);
    } catch (error) {
      console.error('Error fetching partners:', error);
     
    } finally {
      setLoading(false);
    }
  };

  // Update content section
  const updateContent = async (section: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/content/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: editingContent[section] }),
      });
      
      if (response.ok) {
       
        fetchContent(); // Refresh content after update
      } else {
        throw new Error('Failed to update content');
      }
    } catch (error) {
      console.error('Error updating content:', error);
   
    } finally {
      setLoading(false);
    }
  };

  // Handle partner form submission
  const handlePartnerSubmit = async () => {
    try {
      setLoading(true);
      const method = currentPartner.id ? 'PUT' : 'POST';
      const url = currentPartner.id 
        ? `${process.env.NEXT_PUBLIC_API_URL}/partners/${currentPartner.id}` 
        : `${process.env.NEXT_PUBLIC_API_URL}/partners`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentPartner),
      });
      
      if (response.ok) {
      
        setPartnerDialog(false);
        setCurrentPartner({ name: "", description: "", logoUrl: "", websiteUrl: "", isActive: true });
        fetchPartners(); // Refresh partners list
      } else {
        throw new Error(`Failed to ${currentPartner.id ? 'update' : 'create'} partner`);
      }
    } catch (error) {
      console.error('Error submitting partner:', error);
   
    } finally {
      setLoading(false);
    }
  };

  // Delete partner
  const deletePartner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this partner?")) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/partners/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
     
        fetchPartners(); // Refresh partners list
      } else {
        throw new Error('Failed to delete partner');
      }
    } catch (error) {
      console.error('Error deleting partner:', error);
     
    } finally {
      setLoading(false);
    }
  };

  // Edit partner
  const editPartner = (partner: Partner) => {
    setCurrentPartner(partner);
    setPartnerDialog(true);
  };

  const contentvalue = editingContent["vision"]

  console.log("Content Value:", contentvalue);
  

  return (
    <RootLayout>
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Website Content Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="partners">Partners Management</TabsTrigger>
        </TabsList>
        
        {/* Content Management Tab */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Edit Website Content</CardTitle>
              <CardDescription>
                Customize the content displayed on your website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading && <div className="flex justify-center py-6"><Loader2 className="animate-spin" /></div>}
              
              {/* Home Page Content */}
              <div className="space-y-2">
  <Label htmlFor="home-content">Home Page Description</Label>
  <RichTextEditor 
    value={editingContent["vision"] || contentvalue || ""}
    onChange={(value) => setEditingContent({...editingContent, home: value})}
  />
  <div className="flex justify-end">
    <Button 
      onClick={() => updateContent("home")} 
      disabled={loading}
    >
      <Save className="mr-2 h-4 w-4" /> Save Home Content
    </Button>
  </div>
</div>
              
              {/* Vision Content */}
              <div className="space-y-2">
                <Label htmlFor="vision-content">Vision Section</Label>
                <Textarea 
                  id="vision-content"
                  rows={6}
                  value={editingContent["vision"] || ""}
                  onChange={(e) => setEditingContent({...editingContent, vision: e.target.value})} 
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={() => updateContent("vision")} 
                    disabled={loading}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save Vision Content
                  </Button>
                </div>
              </div>
              
              {/* About Content */}
              <div className="space-y-2">
                <Label htmlFor="about-content">About Section</Label>
                <Textarea 
                  id="about-content"
                  rows={6}
                  value={editingContent["about"] || ""}
                  onChange={(e) => setEditingContent({...editingContent, about: e.target.value})} 
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={() => updateContent("about")} 
                    disabled={loading}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save About Content
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Partners Management Tab */}
        <TabsContent value="partners">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Partners Management</CardTitle>
                <CardDescription>
                  Add, edit, or remove partners displayed on your website.
                </CardDescription>
              </div>
              <Dialog open={partnerDialog} onOpenChange={setPartnerDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add New Partner
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{currentPartner.id ? "Edit Partner" : "Add New Partner"}</DialogTitle>
                    <DialogDescription>
                      Fill in the details for this partner.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="partner-name">Partner Name *</Label>
                      <Input 
                        id="partner-name"
                        value={currentPartner.name}
                        onChange={(e) => setCurrentPartner({...currentPartner, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="partner-description">Description</Label>
                      <Textarea 
                        id="partner-description"
                        value={currentPartner.description || ""}
                        onChange={(e) => setCurrentPartner({...currentPartner, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="partner-logo">Logo URL</Label>
                      <Input 
                        id="partner-logo"
                        value={currentPartner.logoUrl || ""}
                        onChange={(e) => setCurrentPartner({...currentPartner, logoUrl: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="partner-website">Website URL</Label>
                      <Input 
                        id="partner-website"
                        value={currentPartner.websiteUrl || ""}
                        onChange={(e) => setCurrentPartner({...currentPartner, websiteUrl: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPartnerDialog(false)}>Cancel</Button>
                    <Button 
                      onClick={handlePartnerSubmit} 
                      disabled={!currentPartner.name || loading}
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {currentPartner.id ? "Update Partner" : "Add Partner"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            
            <CardContent>
              {loading && <div className="flex justify-center py-6"><Loader2 className="animate-spin" /></div>}
              
              {partners.length === 0 && !loading ? (
                <Alert>
                  <AlertDescription>No partners found. Add your first partner to get started.</AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell>{partner.description ? (
                          partner.description.length > 100 
                            ? `${partner.description.substring(0, 100)}...` 
                            : partner.description
                        ) : "-"}</TableCell>
                        <TableCell>{partner.websiteUrl || "-"}</TableCell>
                        <TableCell>{partner.isActive ? "Active" : "Inactive"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => editPartner(partner)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deletePartner(partner.id)}
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
        </TabsContent>
      </Tabs>
    </div>
    </RootLayout>
  );
}