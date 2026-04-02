"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Flag } from "lucide-react";

interface EndedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EndedModal({
  isOpen,
  onClose,
}: EndedModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Flag className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Competition Ended</h2>
        <p className="mb-8 max-w-sm text-sm text-gray-600">
          This competition has officially concluded. Thank you for participating! You may now return to your dashboard.
        </p>
        <Button onClick={onClose} className="w-full" variant="primary">
          Return to Dashboard
        </Button>
      </div>
    </Modal>
  );
}
