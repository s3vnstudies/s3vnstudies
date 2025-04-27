import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from 'wouter';

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

/**
 * Ad Consent Modal
 * 
 * This component displays a GDPR/CCPA compliant consent modal for users
 * to accept or decline personalized advertisements.
 */
export const ConsentModal: React.FC<ConsentModalProps> = ({
  isOpen,
  onAccept,
  onDecline,
}) => {
  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cookies and Advertising Consent</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="mb-4">
              We use cookies and similar technologies to improve your browsing experience, 
              personalize content and ads, and analyze our traffic. We also share information 
              about your use of our site with our advertising and analytics partners.
            </p>
            <p className="mb-4">
              By clicking "Accept All", you consent to our use of cookies and data processing 
              for personalized advertising. You can manage your preferences at any time by 
              visiting our <Link href="/policies/privacy" className="underline text-primary">
                Privacy Policy
              </Link>.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onDecline}>
            Decline
          </AlertDialogCancel>
          <AlertDialogAction onClick={onAccept}>
            Accept All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConsentModal;