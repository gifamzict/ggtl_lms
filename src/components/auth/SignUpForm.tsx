import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStudentAuth } from '@/hooks/useStudentAuth';
import { SocialLoginButtons } from './SocialLoginButtons';

interface SignUpFormProps {
  onSuccess: () => void;
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp } = useStudentAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signUp(username, fullName, email, password, passwordConfirmation);
      if (!error) {
        onSuccess();
      }
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className= "space-y-6" >
    <SocialLoginButtons onSuccess={ onSuccess } />

      < div className = "relative" >
        <div className="absolute inset-0 flex items-center" >
          <span className="w-full border-t" />
            </div>
            < div className = "relative flex justify-center text-xs uppercase" >
              <span className="bg-background px-2 text-muted-foreground" >
                Or sign up with email
                </span>
                </div>
                </div>

                < form onSubmit = { handleSubmit } className = "space-y-4" >
                  <div className="space-y-2" >
                    <Label htmlFor="username" > Username </Label>
                      < Input
  id = "username"
  type = "text"
  placeholder = "Choose a username"
  value = { username }
  onChange = {(e) => setUsername(e.target.value)
}
required
disabled = { loading }
  />
  </div>

  < div className = "space-y-2" >
    <Label htmlFor="fullName" > Full Name </Label>
      < Input
id = "fullName"
type = "text"
placeholder = "Enter your full name"
value = { fullName }
onChange = {(e) => setFullName(e.target.value)}
required
disabled = { loading }
  />
  </div>

  < div className = "space-y-2" >
    <Label htmlFor="email" > Email </Label>
      < Input
id = "email"
type = "email"
placeholder = "Enter your email"
value = { email }
onChange = {(e) => setEmail(e.target.value)}
required
disabled = { loading }
  />
  </div>

  < div className = "space-y-2" >
    <Label htmlFor="password" > Password </Label>
      < div className = "relative" >
        <Input
              id="password"
type = { showPassword? 'text': 'password' }
placeholder = "Create a password"
value = { password }
onChange = {(e) => setPassword(e.target.value)}
required
disabled = { loading }
className = "pr-10"
minLength = { 8}
  />
  <Button
              type="button"
variant = "ghost"
size = "sm"
className = "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
onClick = {() => setShowPassword(!showPassword)}
disabled = { loading }
  >
  {
    showPassword?(
                <EyeOff className = "h-4 w-4 text-muted-foreground" />
              ): (
        <Eye className = "h-4 w-4 text-muted-foreground" />
              )}
</Button>
  </div>
  < p className = "text-xs text-muted-foreground" >
    Password must be at least 8 characters
      </p>
      </div>

      < div className = "space-y-2" >
        <Label htmlFor="passwordConfirmation" > Confirm Password </Label>
          < div className = "relative" >
            <Input
              id="passwordConfirmation"
type = { showPasswordConfirmation? 'text': 'password' }
placeholder = "Confirm your password"
value = { passwordConfirmation }
onChange = {(e) => setPasswordConfirmation(e.target.value)}
required
disabled = { loading }
className = "pr-10"
minLength = { 8}
  />
  <Button
              type="button"
variant = "ghost"
size = "sm"
className = "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
onClick = {() => setShowPasswordConfirmation(!showPasswordConfirmation)}
disabled = { loading }
  >
  {
    showPasswordConfirmation?(
                <EyeOff className = "h-4 w-4 text-muted-foreground" />
              ): (
        <Eye className = "h-4 w-4 text-muted-foreground" />
              )}
</Button>
  </div>
  </div>

  < motion.div
whileHover = {{ scale: 1.02 }}
whileTap = {{ scale: 0.98 }}
        >
  <Button
            type="submit"
className = "w-full"
disabled = { loading }
  >
  { loading? 'Creating account...': 'Sign Up' }
  </Button>
  </motion.div>

  < p className = "text-xs text-center text-muted-foreground" >
    By signing up, you agree to our{ ' ' }
<Button variant="link" className = "p-0 h-auto text-xs" >
  Terms of Service
    </Button>{' '}
          and{ ' ' }
<Button variant="link" className = "p-0 h-auto text-xs" >
  Privacy Policy
    </Button>
    </p>
    </form>
    </div>
  );
}