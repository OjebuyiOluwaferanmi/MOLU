import { useState, type FormEvent } from "react";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../../components/users/Auth/AuthContext";

const inputClass =
  "rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

export default function AccountManagement() {
  const { user } = useAuth();
  // TODO: swap these two handlers for the real updateProfile /
  // changePassword calls once AuthContext exposes them — this page is
  // scaffolded against the user shape seen in Navbar/Signup
  // (firstName, lastName, email, phone, country, gender, dob) but the
  // actual mutation functions don't exist in AuthContext yet.

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: call real updateProfile({ firstName, lastName, phone }) here
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }

    // TODO: call real changePassword({ currentPassword, newPassword }) here
    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm text-gray-500">You need to be signed in to manage your account.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Profile details */}
      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">Account Management</h1>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3 text-left">
          <div className="grid grid-cols-1 gap-x-5 gap-y-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-700">
              Email Address
              <span className="flex items-center gap-1 text-[10px] font-normal text-gray-400">
                <ShieldCheck className="h-3 w-3" />
                Can't be changed
              </span>
            </label>
            <div className="relative">
              <input disabled value={user.email} className={`w-full pl-10 ${inputClass}`} />
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-300" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234 800 000 0000"
              className={inputClass}
            />
          </div>

          {profileSaved && (
            <p className="text-sm font-medium text-green-600">Profile updated successfully.</p>
          )}

          <button
            type="submit"
            className="mt-1 w-full cursor-pointer rounded-full bg-[#3654D6] py-3 text-sm font-bold text-white transition-colors hover:bg-[#2d47bd] sm:w-fit sm:px-8"
          >
            Save Changes
          </button>
        </form>
      </section>

      {/* Change password */}
      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
          <Lock className="h-4 w-4 text-[#3654D6]" />
          Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 text-left">
          {passwordError && (
            <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-brand-red">
              {passwordError}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Current Password</label>
            <input
              required
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">New Password</label>
              <input
                required
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">Confirm New Password</label>
              <input
                required
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {passwordSaved && (
            <p className="text-sm font-medium text-green-600">Password changed successfully.</p>
          )}

          <button
            type="submit"
            className="mt-1 w-full cursor-pointer rounded-full bg-[#3654D6] py-3 text-sm font-bold text-white transition-colors hover:bg-[#2d47bd] sm:w-fit sm:px-8"
          >
            Update Password
          </button>
        </form>
      </section>
    </div>
  );
}