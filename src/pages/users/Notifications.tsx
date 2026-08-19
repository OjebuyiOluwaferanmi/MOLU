import { Switch } from "@heroui/react";
import { Package, BadgePercent, ShieldCheck, Mail, type LucideIcon } from "lucide-react";
import { useNotificationPreferences } from "../../hooks/UseNotificationPreferences";

function PreferenceRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  disabled,
  lockedNote,
}: {
  icon: LucideIcon;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  lockedNote?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-brand-blue">
          <Icon className="h-4 w-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
          {lockedNote && <p className="mt-1 text-[11px] text-gray-400">{lockedNote}</p>}
        </div>
      </div>

      <Switch isSelected={checked} onChange={onChange} isDisabled={disabled} aria-label={label}>
        <Switch.Content>
          <Switch.Control className="data-[selected=true]:!bg-brand-blue">
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
    </div>
  );
}

export default function Notifications() {
  const { preferences, setPreference } = useNotificationPreferences();

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-6">
      <h1 className="text-lg font-bold text-gray-900 sm:text-xl">Notifications</h1>
      <p className="mt-1 text-sm text-gray-500">
        Choose what you&apos;d like to hear from us. Changes save automatically.
      </p>

      <div className="mt-4">
        <PreferenceRow
          icon={Package}
          label="Order Updates"
          description="Order confirmed, shipped, and delivered notifications."
          checked={preferences.orderUpdates}
          onChange={(value) => setPreference("orderUpdates", value)}
        />
        <PreferenceRow
          icon={BadgePercent}
          label="Promotions & Offers"
          description="New coupons, discounts, and exclusive deals."
          checked={preferences.promotions}
          onChange={(value) => setPreference("promotions", value)}
        />
        <PreferenceRow
          icon={ShieldCheck}
          label="Security Alerts"
          description="Login notifications and account security updates."
          checked={preferences.securityAlerts}
          onChange={() => {}}
          disabled
          lockedNote="Security alerts can't be turned off, to keep your account safe."
        />
        <PreferenceRow
          icon={Mail}
          label="Newsletter"
          description="Occasional updates, tips, and announcements from Molu."
          checked={preferences.newsletter}
          onChange={(value) => setPreference("newsletter", value)}
        />
      </div>
    </div>
  );
}