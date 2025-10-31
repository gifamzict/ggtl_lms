import { useState } from 'react';
import { Eye, EyeOff, Lock, ArrowRight, Sparkles, Shield, CheckCircle, AlertCircle, Heart, Zap, Star, User, UserPlus } from 'lucide-react';
import { studentAuthApi } from '../../services/api/studentAuthApi';
import { useLaravelAuth } from '../../store/laravelAuthStore';
import UserProfile from './UserProfile';

const AdvancedLoginForm = ({ onSuccess = () => { } }) => {
  const { user, login, isAuthenticated } = useLaravelAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [fullName, setFullName] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registrationData, setRegistrationData] = useState({ email: '', name: '' });
  const [errors, setErrors] = useState({ email: '', password: '', fullName: '', passwordConfirmation: '' });
  const [touched, setTouched] = useState({ email: false, password: false, fullName: false, passwordConfirmation: false });

  // Real-time validation
  const validateEmail = (value) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
    return '';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    return '';
  };



  const validateFullName = (value) => {
    if (!value && isSignUp) return 'Full name is required';
    if (value && value.length < 2) return 'Full name must be at least 2 characters';
    return '';
  };

  const validatePasswordConfirmation = (value) => {
    if (!value && isSignUp) return 'Please confirm your password';
    if (value && value !== password) return 'Passwords do not match';
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
    if (passwordConfirmation && touched.passwordConfirmation) {
      setErrors(prev => ({ ...prev, passwordConfirmation: validatePasswordConfirmation(passwordConfirmation) }));
    }
  };



  const handleFullNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);
    if (touched.fullName) {
      setErrors(prev => ({ ...prev, fullName: validateFullName(value) }));
    }
  };

  const handlePasswordConfirmationChange = (e) => {
    const value = e.target.value;
    setPasswordConfirmation(value);
    if (touched.passwordConfirmation) {
      setErrors(prev => ({ ...prev, passwordConfirmation: validatePasswordConfirmation(value) }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email) }));
    } else if (field === 'password') {
      setErrors(prev => ({ ...prev, password: validatePassword(password) }));
    } else if (field === 'fullName') {
      setErrors(prev => ({ ...prev, fullName: validateFullName(fullName) }));
    } else if (field === 'passwordConfirmation') {
      setErrors(prev => ({ ...prev, passwordConfirmation: validatePasswordConfirmation(passwordConfirmation) }));
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    // Reset form after successful registration
    setEmail('');
    setPassword('');
    setPasswordConfirmation('');
    setFullName('');
    setIsSignUp(false);
    onSuccess();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const fullNameError = validateFullName(fullName);
    const passwordConfirmationError = validatePasswordConfirmation(passwordConfirmation);

    setTouched({
      email: true,
      password: true,
      fullName: isSignUp,
      passwordConfirmation: isSignUp
    });
    setErrors({
      email: emailError,
      password: passwordError,
      fullName: fullNameError,
      passwordConfirmation: passwordConfirmationError
    });

    if (emailError || passwordError || (isSignUp && (fullNameError || passwordConfirmationError))) return;

    setLoading(true);

    try {
      if (isSignUp) {
        const result = await studentAuthApi.register({
          name: fullName, // Use fullName as username since we removed the separate username field
          full_name: fullName,
          email,
          password,
          password_confirmation: passwordConfirmation
        });

        // Store registration data and show success dialog
        setRegistrationData({ email, name: fullName });
        setShowSuccessDialog(true);
      } else {
        const result = await studentAuthApi.login({
          email,
          password
        });

        // Store user data in our Laravel auth store
        if (result.user && result.token) {
          login(result.user, result.token);
          onSuccess();
        }
      }
    } catch (error) {
      console.error(isSignUp ? 'Registration error:' : 'Login error:', error);
      alert(isSignUp ? 'Registration failed. Please try again.' : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInputBorderClass = (field) => {
    if (!touched[field]) return 'border-slate-200 focus:border-purple-400';
    if (errors[field]) return 'border-red-300 focus:border-red-400';
    return 'border-green-300 focus:border-green-400';
  };

  const getInputIconColor = (field) => {
    if (!touched[field]) return 'text-slate-400';
    if (errors[field]) return 'text-red-400';
    return 'text-green-500';
  };

  return (
    <>
    {/* Show UserProfile if authenticated, otherwise show login form */ }
      {
    isAuthenticated && user ? (
      <UserProfile onDashboardAccess= {() => {
  // Handle dashboard navigation - you can implement routing here
  console.log('Navigate to dashboard');
}} />
      ) : (
  <div className= "min-h-screen max-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-y-auto" >
  {/* Animated Background Elements */ }
  < div className = "absolute inset-0" >
    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" > </div>
      < div className = "absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style = {{ animationDelay: '1s' }
}> </div>
  < div className = "absolute bottom-20 left-1/2 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style = {{ animationDelay: '2s' }}> </div>
    </div>

{/* Floating Elements */ }
<div className="absolute top-10 right-20 text-purple-400 opacity-20 animate-bounce" style = {{ animationDuration: '3s' }}>
  <Star className="h-8 w-8" fill = "currentColor" />
    </div>
    < div className = "absolute bottom-20 left-20 text-pink-400 opacity-20 animate-bounce" style = {{ animationDuration: '4s', animationDelay: '1s' }}>
      <Zap className="h-10 w-10" fill = "currentColor" />
        </div>
        < div className = "absolute top-1/3 left-10 text-blue-400 opacity-20 animate-bounce" style = {{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
          <Heart className="h-7 w-7" fill = "currentColor" />
            </div>

            < div className = "w-full max-w-md relative z-10 my-8" >
              {/* Glow Effect Behind Card */ }
              < div className = "absolute -inset-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-3xl blur-3xl opacity-30 group-hover:opacity-40 transition-opacity" > </div>

{/* Main Card */ }
<div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden max-h-[90vh] overflow-y-auto" >
  {/* Gradient Top Border */ }
  < div className = "h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" > </div>

    < div className = "p-6 sm:p-10" >
      {/* Header with Animation */ }
      < div className = "text-center mb-10" >
        {/* Animated Icon */ }
        < div className = "relative inline-block mb-6" >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl blur-xl opacity-50 animate-pulse" > </div>
            < div className = "relative w-20 h-20 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300" >
              <Shield className="h-10 w-10 text-white" />
                </div>
                </div>

{/* Welcome Badge */ }
<div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 rounded-full px-5 py-2.5 mb-5 border border-purple-200/50 backdrop-blur-sm" >
  <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent" >
      { isSignUp? 'Join GGTL Today': 'Welcome Back to GGTL' }
      </span>
      </div>

{/* Title */ }
<h2 className="text-4xl font-black mb-3" >
  <span className="bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800 bg-clip-text text-transparent" >
    { isSignUp? 'Create Account': 'Sign In' }
    </span>
    </h2>
    < p className = "text-slate-600 text-lg" >
      { isSignUp? 'Start your amazing learning journey': 'Continue your amazing learning journey' }
      </p>
      </div>

{/* Login Form */ }
<div className="space-y-6" >


  {/* Full Name Input - Only for Sign Up */ }
{
  isSignUp && (
    <div className="space-y-2" >
      <label htmlFor="fullName" className = "block text-sm font-bold text-slate-700 flex items-center gap-2" >
        <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-blue-500 rounded-full" > </div>
                    Full Name
    </label>
    < div className = "relative group" >
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10" >
        <UserPlus className={ `h-5 w-5 transition-all duration-300 ${getInputIconColor('fullName')}` } />
          </div>
          < input
  id = "fullName"
  type = "text"
  placeholder = "Enter your full name"
  value = { fullName }
  onChange = { handleFullNameChange }
  onBlur = {() => handleBlur('fullName')
}
disabled = { loading }
className = {`w-full pl-14 pr-14 py-4 bg-slate-50/50 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${getInputBorderClass('fullName')}`}
                    />
{
  touched.fullName && !errors.fullName && (
    <div className="absolute inset-y-0 right-0 pr-5 flex items-center" >
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center" >
        <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          </div>
                    )
}
{
  !touched.fullName && (
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" > </div>
                    )
}
</div>
{
  touched.fullName && errors.fullName && (
    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 px-4 py-2 rounded-xl border border-red-200" >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
        { errors.fullName }
        </div>
                  )
}
</div>
              )}

{/* Email Input */ }
<div className="space-y-2" >
  <label htmlFor="email" className = "block text-sm font-bold text-slate-700 flex items-center gap-2" >
    <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" > </div>
                  Email Address
  </label>
  < div className = "relative group" >
    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10" >
      <User className={ `h-5 w-5 transition-all duration-300 ${getInputIconColor('email')}` } />
        </div>
        < input
id = "email"
type = "email"
placeholder = "you@example.com"
value = { email }
onChange = { handleEmailChange }
onBlur = {() => handleBlur('email')}
disabled = { loading }
className = {`w-full pl-14 pr-14 py-4 bg-slate-50/50 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${getInputBorderClass('email')}`}
                  />
{
  touched.email && !errors.email && (
    <div className="absolute inset-y-0 right-0 pr-5 flex items-center" >
      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center" >
        <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          </div>
                  )
}
{
  !touched.email && (
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" > </div>
                  )
}
</div>
{
  touched.email && errors.email && (
    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 px-4 py-2 rounded-xl border border-red-200" >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
        { errors.email }
        </div>
                )
}
</div>

{/* Password Input */ }
<div className="space-y-2" >
  <label htmlFor="password" className = "block text-sm font-bold text-slate-700 flex items-center gap-2" >
    <div className="w-1 h-4 bg-gradient-to-b from-pink-500 to-blue-500 rounded-full" > </div>
Password
  </label>
  < div className = "relative group" >
    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10" >
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
className = {`w-full pl-14 pr-14 py-4 bg-slate-50/50 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${getInputBorderClass('password')}`}
                  />
  < button
type = "button"
onClick = {() => setShowPassword(!showPassword)}
disabled = { loading }
className = "absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 z-10"
  >
  {
    showPassword?(
                      <EyeOff className = "h-5 w-5" />
                    ): (
        <Eye className = "h-5 w-5" />
                    )}
</button>
{
  !touched.password && (
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" > </div>
                  )
}
</div>
{
  touched.password && errors.password && (
    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 px-4 py-2 rounded-xl border border-red-200" >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
        { errors.password }
        </div>
                )
}
{
  touched.password && !errors.password && password.length >= 8 && (
    <div className="flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 px-4 py-2 rounded-xl border border-green-200" >
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
        Strong password! You're all set
          </div>
                )
}
</div>

{/* Password Confirmation Input - Only for Sign Up */ }
{
  isSignUp && (
    <div className="space-y-2" >
      <label htmlFor="passwordConfirmation" className = "block text-sm font-bold text-slate-700 flex items-center gap-2" >
        <div className="w-1 h-4 bg-gradient-to-b from-pink-500 to-blue-500 rounded-full" > </div>
                    Confirm Password
    </label>
    < div className = "relative group" >
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10" >
        <Lock className={ `h-5 w-5 transition-all duration-300 ${getInputIconColor('passwordConfirmation')}` } />
          </div>
          < input
  id = "passwordConfirmation"
  type = { showPasswordConfirmation? 'text': 'password' }
  placeholder = "Confirm your password"
  value = { passwordConfirmation }
  onChange = { handlePasswordConfirmationChange }
  onBlur = {() => handleBlur('passwordConfirmation')
}
disabled = { loading }
className = {`w-full pl-14 pr-14 py-4 bg-slate-50/50 border-2 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${getInputBorderClass('passwordConfirmation')}`}
                    />
  < button
type = "button"
onClick = {() => setShowPasswordConfirmation(!showPasswordConfirmation)}
disabled = { loading }
className = "absolute inset-y-0 right-0 pr-5 flex items-center text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50 z-10"
  >
  {
    showPasswordConfirmation?(
                        <EyeOff className = "h-5 w-5" />
                      ): (
        <Eye className = "h-5 w-5" />
                      )}
</button>
{
  !touched.passwordConfirmation && (
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" > </div>
                    )
}
</div>
{
  touched.passwordConfirmation && errors.passwordConfirmation && (
    <div className="flex items-center gap-2 text-red-600 text-sm font-semibold bg-red-50 px-4 py-2 rounded-xl border border-red-200" >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
        { errors.passwordConfirmation }
        </div>
                  )
}
{
  touched.passwordConfirmation && !errors.passwordConfirmation && passwordConfirmation.length >= 8 && (
    <div className="flex items-center gap-2 text-green-600 text-sm font-semibold bg-green-50 px-4 py-2 rounded-xl border border-green-200" >
      <CheckCircle className="h-4 w-4 flex-shrink-0" />
        Passwords match perfectly!
          </div>
                  )
}
</div>
              )}

{/* Remember Me & Forgot Password - Only for Login */ }
{
  !isSignUp && (
    <div className="flex items-center justify-between pt-2" >
      <label className="flex items-center gap-3 cursor-pointer group" >
        <div className="relative" >
          <input
                        type="checkbox"
  checked = { rememberMe }
  onChange = {(e) => setRememberMe(e.target.checked)
}
className = "sr-only"
  />
  <div className={
  `w-6 h-6 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${rememberMe
    ? 'bg-gradient-to-br from-purple-600 to-blue-600 border-purple-600 shadow-lg'
    : 'border-slate-300 bg-white group-hover:border-purple-400'
    }`
}>
  { rememberMe && (
    <CheckCircle className="h-5 w-5 text-white" strokeWidth = { 3} />
                        )}
</div>
  </div>
  < span className = "text-sm text-slate-700 font-semibold group-hover:text-slate-900 transition-colors" >
    Keep me signed in
      </span>
      </label>
      < button
type = "button"
className = "text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all"
  >
  Forgot password ?
    </button>
    </div>
              )}

{/* Submit Button */ }
<button
                onClick={ handleSubmit }
disabled = {
  loading ||
  !!errors.email ||
  !!errors.password ||
  !email ||
  !password ||
  (isSignUp && (!!errors.fullName || !!errors.passwordConfirmation || !fullName || !passwordConfirmation))
                }
className = "group relative w-full py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden mt-8"
  >
  <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" > </div>
    < span className = "relative z-10 flex items-center justify-center gap-3" >
    {
      loading?(
                    <>
      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" > </div>
        < span > { isSignUp? 'Creating your account...': 'Signing you in...' } </span>
        </>
                  ) : (
  <>
  <span>{ isSignUp? 'Create Account': 'Sign In to Dashboard' } </span>
  < ArrowRight className = "h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
    </>
                  )}
</span>
  </button>

{/* Security Badge */ }
<div className="mt-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-200/50" >
  <div className="flex items-center gap-4" >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg" >
      <Shield className="h-6 w-6 text-white" />
        </div>
        < div >
        <div className="font-black text-emerald-900 text-sm" >🔒 Bank - Level Security </div>
          < div className = "text-emerald-700 text-sm font-medium" > Your data is encrypted with 256 - bit SSL protection </div>
            </div>
            </div>
            </div>

{/* Sign Up Link */ }
<div className="text-center pt-6 pb-2" >
  <p className="text-slate-600 text-base" >
    { isSignUp? 'Already have an account?': 'New to GGTL?' }{ ' ' }
<button 
      onClick={ () => setIsSignUp(!isSignUp) }
className = "font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-blue-700 transition-all"
  >
  { isSignUp? 'Sign in instead →': 'Create free account →' }
  </button>
  </p>
  </div>
  </div>
  </div>
  </div>
  </div>

{/* Success Dialog */ }
{
  showSuccessDialog && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick = { handleSuccessDialogClose } >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300" onClick = {(e) => e.stopPropagation()
}>
  <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" >
    <button onClick={ handleSuccessDialogClose } className = "absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors" >
                ✕
</button>
  < div className = "flex justify-center mb-4" >
    <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg" >
      <CheckCircle className="w-10 h-10 text-white" fill = "currentColor" />
        </div>
        </div>
        < div className = "text-center" >
          <h2 className="text-2xl font-bold text-gray-800 mb-2" >🎉 Welcome to Gifamz Africa Learn! </h2>
            < p className = "text-green-600 font-semibold" > Registration Successful </p>
              </div>
              </div>
              < div className = "px-8 py-6" >
                <div className="text-center mb-6" >
                  <p className="text-lg text-gray-700" > Hello < span className = "font-bold text-gray-800" > { registrationData.name } < /span>! 👋</p >
                    <p className="text-gray-600 mt-1" > Your account has been created successfully.</p>
                      </div>
                      < div className = "bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100" >
                        <div className="flex items-start space-x-3" >
                          <div className="flex-shrink-0" >
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center" >
                              <CheckCircle className="w-5 h-5 text-white" />
                                </div>
                                </div>
                                < div className = "flex-1" >
                                  <h3 className="text-sm font-bold text-gray-800 mb-1" >� Ready to Learn </h3>
                                    < p className = "text-sm text-gray-600 leading-relaxed" >
                                      You can now access all courses and start your learning journey with Gifamz Africa Learn.
                                        </p>
                                        < p className = "text-sm text-gray-600 mt-1" > Click "Continue" to proceed to your dashboard.</p>
                                          </div>
                                          </div>
                                          </div>
                                          < div className = "mt-5 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100" >
                                            <p className="text-sm text-gray-600 text-center" >💡 <span className="font-semibold" > Pro Tip: </span> Explore our wide range of courses and start building your skills today!</p >
                                              </div>
                                              < div className = "mt-8 flex justify-center" >
                                                <button onClick={ handleSuccessDialogClose } className = "px-8 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" >
                                                  Got it! ✨
</button>
  </div>
  </div>
  </div>
  </div>
      )}
</div>
      )}
</>
  );
};

export { AdvancedLoginForm as LoginForm };
export default AdvancedLoginForm;