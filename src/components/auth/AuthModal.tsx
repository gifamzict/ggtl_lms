import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/store/authStore';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { SocialLoginButtons } from './SocialLoginButtons';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuthStore();
  const [activeTab, setActiveTab] = useState('login');

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-center flex-1">
              Welcome to GGTL
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="login" className="space-y-4">
                  <LoginForm onSuccess={closeAuthModal} />
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  <SignUpForm onSuccess={closeAuthModal} />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}