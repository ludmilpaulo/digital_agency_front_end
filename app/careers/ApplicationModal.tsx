// components/ApplicationModal.tsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { baseAPI } from "@/useAPI/api";
import { Transition } from "@headlessui/react";

interface ApplicationModalProps {
  isOpen: boolean;
  closeModal: () => void;
  careerTitle: string;
  careerId: number;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  closeModal,
  careerTitle,
  careerId,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resume, setResume] = useState<File | null>(null);

  const handleApply = async () => {
    console.log("click")
    if (!resume) return alert("Please attach a resume.");
    setLoading(true);
    const formData = new FormData();
    formData.append("career", String(careerId));
    formData.append("full_name", fullName);
    formData.append("email", email);
    formData.append("resume", resume);

    const response = await fetch(`${baseAPI}/careers/apply-for-job/`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setLoading(false);
      alert("Application submitted successfully!");
      closeModal();
    } else {
      setLoading(false);
      alert("Failed to submit application.");
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={closeModal}
      className="fixed inset-0 z-10 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
      <Transition
          show={loading}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {loading && (
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
              <div className="w-32 h-32 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </Transition>
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75" />

        <div className="relative bg-white p-6 rounded shadow-lg max-w-md mx-auto">
          <h2 className="text-lg font-bold mb-4">Apply for {careerTitle}</h2>
          <input
            type="text"
            placeholder="Please type your Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          <input
            type="email"
            placeholder="Please type your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full mb-4"
          />
          <input
            type="file"
            onChange={(e) =>
              setResume(e.target.files ? e.target.files[0] : null)
            }
            className="file w-full mb-4"
          />
          <button
            onClick={handleApply}
            className="bg-green-500 rounded-md w-full"
          >
            Submit Application
          </button>
        </div>
      </div>
    </Dialog>
  );
};
