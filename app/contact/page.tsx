"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";

interface FormData {
  subject: string;
  from_email: string;
  phone: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    from_email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/api/contacts/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Message sent successfully!");
      setFormData({
        subject: "",
        from_email: "",
        phone: "",
        message: "",
      });
    } else {
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Subject"
          className="block w-full p-2 border rounded"
        />
        <input
          type="email"
          name="from_email"
          value={formData.from_email}
          onChange={handleChange}
          placeholder="Email"
          className="block w-full p-2 border rounded"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="block w-full p-2 border rounded"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Message"
          className="block w-full p-4 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;
