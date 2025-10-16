import ResetPasswordClient from "./ResetPasswordClient";

export const metadata = {
  title: "Reset Password | Maindo Digital",
  description: "Create your new password",
};

export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}

