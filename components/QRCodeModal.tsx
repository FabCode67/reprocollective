'use client';

import React, { useRef, useState } from 'react';
import { QrCode, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationId: string;
  locationName: string;
  locationAddress?: string;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  locationId,
  locationName,
  locationAddress
}) => {
  const [qrSize, setQrSize] = useState<number>(300);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Get the base URL for the QR code
  const getQRCodeData = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/donate?id=${locationId}`;
  };

  // Generate QR code SVG data
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(getQRCodeData())}&size=${qrSize}x${qrSize}`;

  // Handle download of QR code image
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Fetch the image from the QR code API
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `${locationName.replace(/\s+/g, '-')}-QRcode.png`;
      
      // Trigger download
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast(
        <div>
          <strong>QR Code Downloaded</strong>
          <p>The QR code image has been downloaded successfully.</p>
        </div>
      );
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast(
        <div className="text-destructive">
          <strong>Download Failed</strong>
          <p>There was an error downloading the QR code image.</p>
        </div>
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `QR Code for ${locationName}`,
          text: `Scan this QR code to donate to REPROCOLLECTIVE at ${locationName}`,
          url: getQRCodeData(),
        });
        
        toast(
          <div>
            <strong>QR Code Shared</strong>
            <p>The QR code has been shared successfully.</p>
          </div>
        );
      } catch (error) {
        console.error('Error sharing QR code:', error);
        
        // If user canceled sharing, don't show error toast
        if (error instanceof Error && error.name !== 'AbortError') {
          toast(
            <div className="text-destructive">
              <strong>Share Failed</strong>
              <p>There was an error sharing the QR code.</p>
            </div>
          );
        }
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(getQRCodeData());
        toast(
          <div>
            <strong>Link Copied</strong>
            <p>The donation link has been copied to your clipboard.</p>
          </div>
        );
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast(
          <div className="text-destructive">
            <strong>Copy Failed</strong>
            <p>There was an error copying the donation link.</p>
          </div>
        );
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <QrCode className="h-5 w-5 text-[#F77665]" />
            QR Code for {locationName}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {locationAddress && <span>Location: {locationAddress}</span>}
            <br />
            <span className="text-xs text-gray-500">
              When scanned, this QR code will direct users to a donation page for this location.
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4">
          <div 
            ref={qrRef} 
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4"
          >
            {/* QR Code Image */}
            <img 
              src={qrCodeUrl} 
              alt={`QR Code for ${locationName}`}
              className="w-full h-auto"
            />
          </div>

          <div className="w-full space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="qrSize" className="min-w-24">QR Code Size:</Label>
              <Input
                id="qrSize"
                type="range"
                min="100"
                max="500"
                step="50"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full"
              />
              <span className="text-sm">{qrSize}px</span>
            </div>

            <div className="flex items-center gap-2">
              <Label className="min-w-24">Donation URL:</Label>
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={getQRCodeData()}
                  readOnly
                  className="pr-10 text-xs sm:text-sm font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full sm:w-auto bg-[#F77665] hover:bg-[#F77665]/90"
          >
            {isDownloading ? (
              <>Downloading...</>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeModal;