'use client';

import { useState, useRef } from 'react';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url?: string;
}

export default function ShareButtons({ title, description, url }: ShareButtonsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShareImage = async (): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Set canvas size for social media (1200x630 is optimal for most platforms)
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
    gradient.addColorStop(0, '#0ea5e9');
    gradient.addColorStop(1, '#0284c7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 630);

    // Add subtle pattern overlay
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 1200, Math.random() * 630, Math.random() * 100 + 50, 0, Math.PI * 2);
      ctx.fill();
    }

    // White card background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    roundRect(ctx, 60, 60, 1080, 510, 20);
    ctx.fill();

    // Logo text
    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
    ctx.fillText('LegacyToCloud', 100, 130);

    // Title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';

    // Word wrap title
    const words = title.split(' ');
    let line = '';
    let y = 220;
    const maxWidth = 980;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line.trim(), 100, y);
        line = word + ' ';
        y += 60;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 100, y);

    // Description
    if (description) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '28px system-ui, -apple-system, sans-serif';

      const descWords = description.split(' ');
      let descLine = '';
      let descY = y + 80;

      for (const word of descWords) {
        const testLine = descLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && descLine !== '') {
          ctx.fillText(descLine.trim(), 100, descY);
          descLine = word + ' ';
          descY += 40;
          if (descY > 480) break;
        } else {
          descLine = testLine;
        }
      }
      if (descY <= 480) {
        ctx.fillText(descLine.trim(), 100, descY);
      }
    }

    // URL at bottom
    const displayUrl = url || (typeof window !== 'undefined' ? window.location.href : 'legacytocloud.com');
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px system-ui, -apple-system, sans-serif';
    ctx.fillText(displayUrl.replace(/^https?:\/\//, ''), 100, 530);

    // Database icons at bottom right
    drawDatabaseIcons(ctx);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), 'image/png', 1.0);
    });
  };

  const drawDatabaseIcons = (ctx: CanvasRenderingContext2D) => {
    const startX = 900;
    const y = 480;

    // SQL Server icon
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(startX, y, 50, 50, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px system-ui';
    ctx.fillText('SQL', startX + 8, y + 32);

    // Arrow
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px system-ui';
    ctx.fillText('→', startX + 60, y + 35);

    // Snowflake icon
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.roundRect(startX + 90, y, 50, 50, 8);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 20px system-ui';
    ctx.fillText('❄', startX + 105, y + 35);
  };

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const shareToTwitter = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const text = `${title}${description ? ' - ' + description : ''}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareToLinkedIn = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const shareToFacebook = async () => {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const downloadImage = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateShareImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-legacytocloud.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyImageToClipboard = async () => {
    setIsGenerating(true);
    try {
      const blob = await generateShareImage();
      if (blob && navigator.clipboard && 'write' in navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        alert('Image copied to clipboard!');
      } else {
        // Fallback: download instead
        await downloadImage();
      }
    } catch {
      // Fallback: download instead
      await downloadImage();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Twitter/X */}
      <button
        onClick={shareToTwitter}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        title="Share on X (Twitter)"
      >
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* LinkedIn */}
      <button
        onClick={shareToLinkedIn}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        title="Share on LinkedIn"
      >
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </button>

      {/* Facebook */}
      <button
        onClick={shareToFacebook}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        title="Share on Facebook"
      >
        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1" />

      {/* Download PNG */}
      <button
        onClick={downloadImage}
        disabled={isGenerating}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
        title="Download as PNG"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      </button>

      {/* Copy Image */}
      <button
        onClick={copyImageToClipboard}
        disabled={isGenerating}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
        title="Copy image to clipboard"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
}
