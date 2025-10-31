import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuthStore } from '@/store/authStore';
import { LoginForm } from './LoginForm';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useAuthStore();

  return (
    <Dialog open= { isAuthModalOpen } onOpenChange = { closeAuthModal } >
      <DialogContent className="sm:max-w-md" >
        <DialogHeader>
        <div className="flex items-center justify-between" >
          <DialogTitle className="text-2xl font-bold text-center flex-1" >
            Welcome to GGTL
              </DialogTitle>
              </div>
              </DialogHeader>

              < AnimatePresence mode = "wait" >
                <motion.div
            initial={ { opacity: 0, y: 20 } }
  animate = {{ opacity: 1, y: 0 }
}
exit = {{ opacity: 0, y: -20 }}
transition = {{ duration: 0.3 }}
          >
  <div className="mt-6" >
    <LoginForm onSuccess={ closeAuthModal } />
      </div>
      </motion.div>
      </AnimatePresence>
      </DialogContent>
      </Dialog>
  );
}