import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { Calendar, DateField, DatePicker, Dropdown, Label, Button } from "@heroui/react";
import type { DateValue } from "@internationalized/date";
import { AuthLayout } from "../../components/users/Auth/AuthLayout";
import { SocialAuthButtons } from "../../components/users/Auth/SocialAuthButtons";
import { AuthDivider } from "../../components/users/Auth/AuthDivider";
import { useAuth } from "../../components/users/Auth/AuthContext";

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
  "rounded-full border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3654D6] focus:outline-none";

/** Strips everything except digits and a single leading "+" — used on
 * every phone input across the app so only numeric-looking values can
 * ever reach state or get submitted (defense in depth alongside
 * server-side validation once a real backend exists). */
export function sanitizePhoneInput(raw: string): string {
  let value = raw.replace(/[^\d+]/g, "");
  if (value.startsWith("+")) {
    value = "+" + value.slice(1).replace(/\+/g, "");
  } else {
    value = value.replace(/\+/g, "");
  }
  return value.slice(0, 16);
}

/** Styled trigger button shared by the Country and Gender dropdowns —
 * matches the pill look of the other inputs on this form. */
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

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<string | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [dob, setDob] = useState<DateValue | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    // Country and gender only ever get set via the dropdowns above, whose
    // options are hardcoded to COUNTRIES/GENDERS — so there's no free-text
    // path for either of these to be anything other than a whitelisted
    // value by the time we get here.
    if (!country) {
      setError("Please select your country.");
      return;
    }
    if (!gender) {
      setError("Please select your gender.");
      return;
    }
    if (phone.length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    const result = signup({
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      gender,
      dob: dob ? dob.toString() : null,
    });

    if (!result.success) {
      setError(result.error);
      return;
    }

    navigate("/");
  };

  return (
    <AuthLayout title="Create your account" subtitle="Sign up to start shopping on Molu">
      <SocialAuthButtons actionLabel="Sign up" />

      <div className="my-4">
        <AuthDivider />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-brand-red">
            {error}
          </p>
        )}

        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="oluwaferanmi"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="ojebuyi"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-xs font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-xs font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a password"
                className={`w-full pr-10 ${inputClass}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className="text-xs font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              required
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
              placeholder="+234 800 000 0000"
              className={inputClass}
            />
          </div>

          {/* Country — HeroUI Dropdown styled as a pill trigger. Only
              way to set this value, so it's always one of COUNTRIES. */}
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
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-gray-700">Date of Birth</span>
            <DatePicker
              className="w-full"
              name="dob"
              aria-label="Date of Birth"
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

        <label className="flex cursor-pointer items-start gap-2.5 rounded-xl bg-gray-50 px-3.5 py-2.5 text-[11px] leading-relaxed text-gray-600">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-gray-300 text-[#3654D6] focus:ring-[#3654D6]"
          />
          <span>
            I agree to Molu&apos;s{" "}
            <Link to="/terms" className="cursor-pointer font-medium text-[#3654D6] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="cursor-pointer font-medium text-[#3654D6] hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        <button
          type="submit"
          className="mt-1 w-full cursor-pointer rounded-full bg-[#3654D6] py-3 text-sm font-bold text-white transition-colors hover:bg-[#2d47bd]"
        >
          Create Account
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="cursor-pointer font-semibold text-[#3654D6] hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}