'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MessageSellerButtonProps {
  productId: string;
}

export function MessageSellerButton({ productId }: MessageSellerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContact = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/messages?chatId=${data.id}`);
      } else {
        alert(data.error || 'Failed to start chat');
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleContact}
      disabled={isLoading}
      variant="secondary" 
      size="lg" 
      className="flex-1 text-base h-12"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <>
          <MessageCircle className="w-5 h-5 mr-2" /> Message Seller
        </>
      )}
    </Button>
  );
}
