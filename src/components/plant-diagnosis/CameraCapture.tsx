
import React, { useRef, useState, useEffect } from "react";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageDataUrl: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request camera permissions
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Não foi possível acessar a câmera. Verifique as permissões.");
        toast.error("Erro ao acessar a câmera", {
          description: "Verifique se concedeu permissão para uso da câmera"
        });
      }
    };

    startCamera();

    return () => {
      // Cleanup: stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match the video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Send image data to the parent component
      onCapture(imageDataUrl);
      
      // Stop all camera tracks
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-700">{error}</p>
            <Button 
              variant="secondary" 
              className="mt-4"
              onClick={onClose}
            >
              Voltar
            </Button>
          </div>
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Hidden canvas for capturing the image */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="p-4 bg-black flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="text-white"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
          <span className="ml-2">Cancelar</span>
        </Button>
        
        <Button
          className="bg-white text-black hover:bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center"
          onClick={captureImage}
          disabled={!!error}
        >
          <div className="w-12 h-12 rounded-full border-4 border-black" />
        </Button>
        
        <div className="w-20" /> {/* Spacer for balance */}
      </div>
    </div>
  );
};
