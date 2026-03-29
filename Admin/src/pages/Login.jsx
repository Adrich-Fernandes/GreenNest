import { SignIn } from "@clerk/clerk-react";

export default function Login() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-3xl mb-4 shadow-sm">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">GreenNest Admin</h1>
          <p className="text-slate-500 mt-2 font-medium">Professional Management Portal</p>
        </div>
        
        <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100">
          <SignIn 
            routing="path" 
            path="/login" 
            signUpUrl="/login" // Disable sign up by pointing to login or just let Clerk handle it
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-none p-6",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "rounded-2xl border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all",
                formButtonPrimary: "bg-emerald-600 hover:bg-emerald-700 rounded-2xl py-3 text-sm font-bold shadow-lg shadow-emerald-200 transition-all normal-case",
                formFieldInput: "rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all",
                footer: "hidden"
              }
            }}
          />
        </div>
        
        <p className="text-center mt-8 text-xs text-slate-400 font-medium">
          Only verified staff and professionals can access this portal.
        </p>
      </div>
    </div>
  );
}
