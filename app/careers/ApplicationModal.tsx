// components/ApplicationModal.tsx
import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { baseAPI } from "@/useAPI/api";

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
  const [resume, setResume] = useState<File | null>(null);

  const handleApply = async () => {
    console.log("click")
    if (!resume) return alert("Please attach a resume.");

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
      alert("Application submitted successfully!");
      closeModal();
    } else {
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
