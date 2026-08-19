import { useState, type FormEvent } from "react";
import { Lock, Mail, ShieldCheck, ChevronDown } from "lucide-react";
import { Calendar, DateField, DatePicker, Dropdown, Label, Button } from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import { parseDate } from "@internationalized/date";
import { useAuth } from "../../components/users/Auth/AuthContext";
import { sanitizePhoneInput } from "./Signup";

const COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "India",
];

const GENDERS = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "other", label: "Other" },
  { id: "prefer-not-to-say", label: "Prefer not to say" },
];

const inputClass =
  "rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

function DropdownField({
  label,
  value,
  placeholder,
}: {
  label: string;
  value: string | null;
  placeholder: string;
}) {
  return (
    <Button
      variant="secondary"
      aria-label={label}
      className={`flex w-full cursor-pointer items-center justify-between !rounded-full !border !border-gray-200 !bg-white !px-4 !py-2.5 !text-left !text-sm !shadow-none hover:!border-gray-300 ${
        value ? "!text-gray-700" : "!text-gray-400"
      }`}
    >
      {value ?? placeholder}
      <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
    </Button>
  );
}

function tryParseDate(value: string | null): DateValue | null {
  if (!value) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

export default function AccountManagement() {
  const { user, updateUser, changePassword } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [country, setCountry] = useState<string | null>(user?.country ?? null);
  const [gender, setGender] = useState<string | null>(user?.gender ?? null);
  const [dob, setDob] = useState<DateValue | null>(tryParseDate(user?.dob ?? null));
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-6 text-center shadow-sm sm:p-8">
        <p className="text-sm text-gray-500">You need to be signed in to manage your account.</p>
      </div>
    );
  }

  const handleProfileSubmit = (e: FormEvent) => {
    e.preventDefault();
    setProfileError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setProfileError("First and last name can't be empty.");
      return;
    }
    if (phone.length < 7) {
      setProfileError("Please enter a valid phone number.");
      return;
    }
    if (!country) {
      setProfileError("Please select your country.");
      return;
    }
    if (!gender) {
      setProfileError("Please select your gender.");
      return;
    }

    updateUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
      country,
      gender,
      dob: dob ? dob.toString() : null,
    });
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

    const result = changePassword(currentPassword, newPassword);
    if (!result.success) {
      setPasswordError(result.error);
      return;
    }

    setPasswordSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Profile details */}
      <section className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
        <h1 className="mb-4 text-lg font-bold text-gray-900 sm:text-xl">Account Management</h1>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3 text-left">
          {profileError && (
            <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-brand-red">
              {profileError}
            </p>
          )}

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
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
              placeholder="+234 800 000 0000"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Country — restricted to the same whitelist as Signup. */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-700">Country</span>
              <Dropdown>
                <DropdownField label="Country" value={country} placeholder="Select country" />
                <Dropdown.Popover className="min-w-[220px] bg-white text-black shadow-lg">
                  <Dropdown.Menu onAction={(key) => setCountry(String(key))}>
                    {COUNTRIES.map((c) => (
                      <Dropdown.Item key={c} id={c} textValue={c}>
                        <Label className="text-black">{c}</Label>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>

            {/* Gender — restricted to the same whitelist as Signup. */}
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-gray-700">Gender</span>
              <Dropdown>
                <DropdownField
                  label="Gender"
                  value={GENDERS.find((g) => g.id === gender)?.label ?? null}
                  placeholder="Select gender"
                />
                <Dropdown.Popover className="min-w-[220px] bg-white text-black shadow-lg">
                  <Dropdown.Menu onAction={(key) => setGender(String(key))}>
                    {GENDERS.map((g) => (
                      <Dropdown.Item key={g.id} id={g.id} textValue={g.label}>
                        <Label className="text-black">{g.label}</Label>
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700">Date of Birth</span>
            <DatePicker
              className="w-full"
              aria-label="Date of Birth"
              defaultValue={dob ?? undefined}
              onChange={(value) => setDob(value)}
            >
              <DateField.Group
                fullWidth
                className="!rounded-full !border !border-gray-200 !bg-white !px-4 !py-2.5 !shadow-none focus-within:!border-[#3654D6]"
              >
                <DateField.Input>
                  {(segment) => <DateField.Segment segment={segment} className="text-sm text-gray-700" />}
                </DateField.Input>
                <DateField.Suffix>
                  <DatePicker.Trigger className="cursor-pointer text-gray-400 hover:text-gray-600">
                    <DatePicker.TriggerIndicator />
                  </DatePicker.Trigger>
                </DateField.Suffix>
              </DateField.Group>
              <DatePicker.Popover>
                <Calendar aria-label="Date of birth">
                  <Calendar.Header>
                    <Calendar.YearPickerTrigger>
                      <Calendar.YearPickerTriggerHeading />
                      <Calendar.YearPickerTriggerIndicator />
                    </Calendar.YearPickerTrigger>
                    <Calendar.NavButton slot="previous" />
                    <Calendar.NavButton slot="next" />
                  </Calendar.Header>
                  <Calendar.Grid>
                    <Calendar.GridHeader>
                      {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                    </Calendar.GridHeader>
                    <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                  </Calendar.Grid>
                  <Calendar.YearPickerGrid>
                    <Calendar.YearPickerGridBody>
                      {({ year }) => <Calendar.YearPickerCell year={year} />}
                    </Calendar.YearPickerGridBody>
                  </Calendar.YearPickerGrid>
                </Calendar>
              </DatePicker.Popover>
            </DatePicker>
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