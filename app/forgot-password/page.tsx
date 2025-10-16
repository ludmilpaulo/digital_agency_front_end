import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata = {
  title: "Forgot Password | Maindo Digital",
  description: "Reset your password",
};

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}

