"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { WifiOff } from "lucide-react";
import Link from "next/link";

interface DisconnectedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DisconnectedModal({
  isOpen,
  onClose,
}: DisconnectedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <WifiOff className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Disconnected</h2>
        <p className="mb-8 max-w-sm text-sm text-gray-600">
          You have been disconnected from the competition server. Please check
          your internet connection and try rejoining.
        </p>
        <Button onClick={onClose} className="w-full" variant="primary">
          Return to Dashboard
        </Button>
      </div>
    </Modal>
  );
}
