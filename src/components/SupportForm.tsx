"use client";

import { useEffect, useMemo, useState } from "react";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import type { SupportFormState, SupportUrgency, SupportCategory, ContactMethod } from "@/lib/types";

interface SupportFormProps {
  visible: boolean;
  onClose: () => void;
}

const emptyForm: SupportFormState = {
  fullName: "",
  email: "",
  subject: "",
  description: "",
  category: "",
  urgency: "",
  contactMethod: "",
};

export default function SupportForm({ visible, onClose }: SupportFormProps) {
  const [formState, setFormState] = useState<SupportFormState>(emptyForm);

  const resetForm = () => setFormState(emptyForm);

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  // Expose form state to the AI
  useCopilotReadable({
    description: "The customer support form fields and their current values",
    value: formState,
  });

  // Allow the AI to fill out the form
  useCopilotAction({
    name: "fill_support_form",
    description: "Fill out the customer support form with provided details",
    parameters: [
      { name: "fullName", type: "string", required: true, description: "The user's full name" },
      { name: "email", type: "string", required: true, description: "The user's email address" },
      { name: "subject", type: "string", required: true, description: "Short subject for the support request" },
      { name: "description", type: "string", required: true, description: "Detailed description of the issue or question" },
      { name: "category", type: "string", required: false, description: "One of billing, technical, account, other" },
      { name: "urgency", type: "string", required: false, description: "One of low, medium, high" },
      { name: "contactMethod", type: "string", required: false, description: "One of email, phone, chat" },
    ],
    handler: async (action) => {
      setFormState((prev) => ({
        ...prev,
        fullName: action.fullName ?? prev.fullName,
        email: action.email ?? prev.email,
        subject: action.subject ?? prev.subject,
        description: action.description ?? prev.description,
        category: (action.category as SupportCategory) ?? prev.category,
        urgency: (action.urgency as SupportUrgency) ?? prev.urgency,
        contactMethod: (action.contactMethod as ContactMethod) ?? prev.contactMethod,
      }));
    },
  });

  const isValid = useMemo(() => {
    return (
      formState.fullName.trim() !== "" &&
      formState.email.trim() !== "" &&
      formState.subject.trim() !== "" &&
      formState.description.trim() !== ""
    );
  }, [formState]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customer Support</h2>
          <button onClick={onClose} className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200">Close</button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Full Name</label>
            <input
              className="rounded-md border border-gray-300 px-3 py-2"
              value={formState.fullName}
              onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Email</label>
            <input
              className="rounded-md border border-gray-300 px-3 py-2"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              placeholder="john@example.com"
              type="email"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Subject</label>
            <input
              className="rounded-md border border-gray-300 px-3 py-2"
              value={formState.subject}
              onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
              placeholder="Brief subject"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Description</label>
            <textarea
              className="min-h-[120px] rounded-md border border-gray-300 px-3 py-2"
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              placeholder="Describe your issue or question in detail"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Category</label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={formState.category}
              onChange={(e) => setFormState({ ...formState, category: e.target.value as SupportCategory })}
            >
              <option value="">Select...</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Urgency</label>
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={formState.urgency}
              onChange={(e) => setFormState({ ...formState, urgency: e.target.value as SupportUrgency })}
            >
              <option value="">Select...</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label className="mb-1 text-sm text-gray-700">Preferred Contact Method</label>
            <div className="flex gap-4">
              {(["email", "phone", "chat"] as ContactMethod[]).map((m) => (
                <label key={m} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="contact"
                    checked={formState.contactMethod === m}
                    onChange={() => setFormState({ ...formState, contactMethod: m })}
                  />
                  <span className="capitalize">{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={resetForm}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm hover:bg-gray-200"
          >
            Reset
          </button>
          <button
            disabled={!isValid}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

