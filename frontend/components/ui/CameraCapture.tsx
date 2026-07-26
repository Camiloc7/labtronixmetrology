'use client';

import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, X, ArrowsLeftRight, Check, ArrowsClockwise } from '@phosphor-icons/react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.9)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 2,
      }}>
        <button 
          onClick={toggleCamera}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <ArrowsLeftRight size={24} />
        </button>
        <button 
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '50%',
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          <X size={24} />
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 600, aspectRatio: '4/3', background: '#000' }}>
        {capturedImage ? (
          <img src={capturedImage} alt="Captured" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        )}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 40,
        display: 'flex',
        gap: 24,
        alignItems: 'center',
      }}>
        {capturedImage ? (
          <>
            <button 
              onClick={handleRetake}
              style={{
                background: 'var(--color-surface)',
                border: 'none',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <ArrowsClockwise size={32} />
            </button>
            <button 
              onClick={handleConfirm}
              style={{
                background: 'var(--color-success)',
                border: 'none',
                borderRadius: '50%',
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <Check size={32} weight="bold" />
            </button>
          </>
        ) : (
          <button 
            onClick={capture}
            style={{
              background: 'white',
              border: '4px solid rgba(255,255,255,0.5)',
              backgroundClip: 'padding-box',
              borderRadius: '50%',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Camera size={32} color="#000" />
          </button>
        )}
      </div>
    </div>
  );
}
