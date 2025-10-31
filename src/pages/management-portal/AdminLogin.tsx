import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, CheckCircle, AlertCircle, Sparkles, Crown, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const PremiumAdminLogin = ({ onSuccess = () => { } }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();
  const { signIn } = useAuth();

  // Real-time validation
  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else if (field === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setTouched({ email: true, password: true });
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) return;

    setLoading(true);

    try {
      console.log('Attempting admin login with:', { email, roleFilter: ['ADMIN', 'SUPER_ADMIN'] });
      const { error } = await signIn(email, password, ['ADMIN', 'SUPER_ADMIN']);

      if (!error) {
        console.log('Admin login successful, navigating to /management-portal');
        toast.success('Login successful!', {
          description: 'Redirecting to dashboard...'
        });

        // Check for redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || '/management-portal';

        // Navigate immediately using window.location for a full page reload
        setTimeout(() => {
          window.location.href = redirect;
        }, 500);
      } else {
        console.error('Admin login failed:', error);
        setErrors({ email: '', password: error.message || 'Login failed' });
        setLoading(false);
      }
    } catch (error) {
      console.error('Admin login error:', error);
      setErrors({ email: '', password: 'An unexpected error occurred' });
      setLoading(false);
    }
  };

  const getInputBorderClass = (field) => {
    if (!touched[field]) return 'border-slate-200 focus:border-indigo-400';
    if (errors[field]) return 'border-red-300 focus:border-red-400';
    return 'border-green-300 focus:border-green-400';
  };

  const getInputIconColor = (field) => {
    if (!touched[field]) return 'text-slate-400';
    if (errors[field]) return 'text-red-400';
    return 'text-green-500';
  };

  return (
    <div className= "min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-y-auto" >
    {/* Animated Background Elements */ }
    < div className = "fixed inset-0 pointer-events-none" >
      <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" > </div>
        < div className = "absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style = {{ animationDelay: '1s' }
}> </div>
  < div className = "absolute bottom-20 left-1/2 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style = {{ animationDelay: '2s' }}> </div>
    </div>

{/* Grid Pattern */ }
<div className="fixed inset-0 opacity-5 pointer-events-none" style = {{
  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
    backgroundSize: '40px 40px'
}}> </div>

{/* Floating Icons */ }
<div className="fixed top-20 right-32 text-indigo-400/20 animate-bounce pointer-events-none" style = {{ animationDuration: '3s' }}>
  <Crown className="h-10 w-10" />
    </div>
    < div className = "fixed bottom-32 left-32 text-purple-400/20 animate-bounce pointer-events-none" style = {{ animationDuration: '4s', animationDelay: '1s' }}>
      <Zap className="h-8 w-8" fill = "currentColor" />
        </div>

        < div className = "w-full max-w-2xl relative z-10" >
          <div className="grid lg:grid-cols-5 gap-8 items-stretch" >
            {/* Left Side - Branding Panel */ }
            < div className = "lg:col-span-2 hidden lg:flex flex-col justify-center text-white space-y-6 bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10" >
              <div className="space-y-4" >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl" >
                  <Crown className="h-8 w-8 text-white" />
                    </div>
                    < h3 className = "text-2xl font-black" > Admin Portal </h3>
                      < p className = "text-white/70 text-sm leading-relaxed" >
                        Secure access to your administrative dashboard with advanced security features.
              </p>
                          </div>

                          < div className = "space-y-3 pt-4" >
                          {
                            [
                              { icon: <Shield className="h-4 w-4" />, text: "256-bit Encryption" },
                              { icon: <CheckCircle className="h-4 w-4" />, text: "2FA Protected" },
                              { icon: <Zap className="h-4 w-4" />, text: "Real-time Monitoring" }
                            ].map((feature, index) => (
                              <div key= { index } className = "flex items-center gap-3 text-white/80 text-sm" >
                              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20" >
                              { feature.icon }
                              </div>
                            < span className = "font-medium" > { feature.text } </span>
                            </div>
                            ))
                          }
                            </div>

                            < div className = "pt-6 mt-auto" >
                              <div className="text-center bg-white/5 rounded-xl p-4 border border-white/10" >
                                <div className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent" >
                                  99.9 %
                                  </div>
                                  < div className = "text-xs text-white/60 font-medium mt-1" > System Uptime </div>
                                    </div>
                                    </div>
                                    </div>

{/* Right Side - Login Form */ }
<div className="lg:col-span-3 relative" >
  {/* Glow Effect Behind Card */ }
  < div className = "absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur-3xl opacity-20" > </div>

{/* Main Card */ }
<div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden" >
  {/* Gradient Top Border */ }
  < div className = "h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600" > </div>

    < div className = "p-8 sm:p-10" >
      {/* Header */ }
      < div className = "text-center mb-8" >
        {/* Mobile Icon (shown on small screens) */ }
        < div className = "lg:hidden relative inline-block mb-6" >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-50 animate-pulse" > </div>
            < div className = "relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl" >
              <Shield className="h-8 w-8 text-white" />
                </div>
                </div>

{/* Badge */ }
<div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full px-4 py-2 mb-4 border border-indigo-200/50" >
  <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
    <span className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" >
      Administrative Access
        </span>
        </div>

        < h2 className = "text-3xl font-black text-slate-900 mb-2" >
          Admin Sign In
            </h2>
            < p className = "text-slate-600" >
              Enter your credentials to access the dashboard
                </p>
                </div>

{/* Form */ }
<div className="space-y-5" >
  {/* Email Input */ }
  < div className = "space-y-2" >
    <label htmlFor="email" className = "block text-sm font-bold text-slate-700 flex items-center gap-2" >
      <div className="w-1 h-4 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" > </div>
                      Admin Email
  </label>
  < div className = "relative group" >
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10" >
      <Mail className={ `h-5 w-5 transition-all duration-300 ${getInputIconColor('email')}` } />
        </div>
        < input
id = "email"
type = "email"
placeholder = "admin@ggtl.tech"
value = { email }
onChange = { handleEmailChange }
onBlur = {() => handleBlur('email')}
disabled = { loading }
className = {`w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${getInputBorderClass('email')}`}
                      />
{
  touched.email && !errors.email && (
    <div className="absolute inset-y-0 right-0 pr-4 flex items-center" >
      <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center" >
        <CheckCircle className="h-4 w-4 text-green-600" />
          </div>
          </div>
                      )
}
</div>
{
  touched.email && errors.email && (
    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 px-3 py-2 rounded-lg border border-red-200" >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
        { errors.email }
        </div>
                    )
}
</div>

{/* Password Input */ }
<div className="space-y-2" >
  <label htmlFor="password" className = "block text-sm font-bold text-slate-700 flex items-center gap-2" >
    <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full" > </div>
Password
  </label>
  < div className = "relative group" >
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10" >
      <Lock className={ `h-5 w-5 transition-all duration-300 ${getInputIconColor('password')}` } />
        </div>
        < input
id = "password"
type = { showPassword? 'text': 'password' }
placeholder = "Enter your password"
value = { password }
onChange = { handlePasswordChange }
onBlur = {() => handleBlur('password')}
disabled = { loading }
className = {`w-full pl-12 pr-12 py-4 bg-slate-50/50 border-2 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${getInputBorderClass('password')}`}
                      />
  < button
type = "button"
onClick = {() => setShowPassword(!showPassword)}
disabled = { loading }
className = "absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 z-10"
  >
  { showPassword?<EyeOff className = "h-5 w-5" /> : <Eye className="h-5 w-5" />}
</button>
  </div>
{
  touched.password && errors.password && (
    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 px-3 py-2 rounded-lg border border-red-200" >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
        { errors.password }
        </div>
                    )
}
</div>

{/* Forgot Password */ }
<div className="flex justify-end pt-1" >
  <button
                      type="button"
className = "text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all"
  >
  Forgot password ?
    </button>
    </div>

                  {/* Submit Button */ }
<button
                    onClick={ handleSubmit }
disabled = { loading || !!errors.email || !!errors.password || !email || !password}
className = "group relative w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-xl font-black text-lg shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
  >
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" > </div>
    < span className = "relative z-10 flex items-center justify-center gap-2" >
    {
      loading?(
                        <>
      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" > </div>
        < span > Signing in...</span>
          </>
                      ) : (
  <>
  <span>Access Admin Panel </span>
    < ArrowRight className = "h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
      </>
                      )}
</span>
  </button>

{/* Security Badge */ }
<div className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200" >
  <div className="flex items-center gap-3" >
    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0 shadow-lg" >
      <Shield className="h-5 w-5 text-white" />
        </div>
        < div className = "text-sm" >
          <div className="font-bold text-green-900" > Secure Connection </div>
            < div className = "text-green-700" > Protected with 256 - bit SSL encryption </div>
              </div>
              </div>
              </div>

{/* Back Link */ }
<div className="text-center pt-4" >
  <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors font-medium" >
                      ← Back to main site
  </button>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  </div>
  );
};

export default PremiumAdminLogin;