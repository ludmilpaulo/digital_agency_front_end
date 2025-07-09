"use client";
import { useEffect, useMemo, useState, Fragment } from "react";
import { fetchCareers } from "@/services/careerService";
import { Career } from "@/types/Career";
import axios from "axios";
import {
  BriefcaseIcon,
  MapPinIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { Transition, Dialog } from "@headlessui/react";
import { baseAPI } from "@/useAPI/api";
import Lottie from "lottie-react";
import loaderLottie from "@/public/lottie/loader.json"; // <- Use a lottie file in /public/lottie

const ITEMS_PER_PAGE = 5;

export default function CareersPage() {
  const [jobs, setJobs] = useState<Career[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "az">("newest");
  const [selectedJob, setSelectedJob] = useState<Career | null>(null);
  const [loading, setLoading] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);

  const [language, setLanguage] = useState<"en" | "pt">("en");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    cover_letter: "",
    resume: null as File | null,
    language: "en",
  });

  const labels = {
    en: {
      fullName: "Full Name",
      email: "Email",
      coverLetter: "Cover Letter",
      resume: "Upload Resume (PDF)",
      submit: "Submit Application",
      language: "Preferred Language",
      apply: "Apply Now",
      back: "Back to Opportunities",
      submitted: "Your application was sent successfully! 🎉",
    },
    pt: {
      fullName: "Nome Completo",
      email: "Email",
      coverLetter: "Carta de Apresentação",
      resume: "Anexar Currículo (PDF)",
      submit: "Enviar Candidatura",
      language: "Idioma Preferido",
      apply: "Candidatar-se",
      back: "Voltar às Oportunidades",
      submitted: "Sua candidatura foi enviada com sucesso! 🎉",
    },
  };

  useEffect(() => {
    const lang = navigator.language.toLowerCase();
    const detected = lang.startsWith("pt") ? "pt" : "en";
    setLanguage(detected);
    setForm((prev) => ({ ...prev, language: detected }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    const formData = new FormData();
    formData.append("career_id", String(selectedJob.id));
    formData.append("full_name", form.full_name);
    formData.append("email", form.email);
    formData.append("cover_letter", form.cover_letter);
    formData.append("language", form.language);
    if (form.resume) formData.append("resume", form.resume);

    setLoading(true);
    try {
      await axios.post(`${baseAPI}/careers/job-applications/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApplicationSent(true);
      setTimeout(() => setApplicationSent(false), 3600);
      setSelectedJob(null);
      setForm({
        full_name: "",
        email: "",
        cover_letter: "",
        resume: null,
        language,
      });
    } catch {
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers().then(setJobs);
  }, []);

  const filteredJobs = useMemo(() => {
    let filtered = jobs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
      );
    }
    if (selectedLocation) {
      filtered = filtered.filter((job) => job.location === selectedLocation);
    }
    if (sortOrder === "az") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered = [...filtered].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return filtered;
  }, [jobs, searchQuery, selectedLocation, sortOrder]);

  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const uniqueLocations = [...new Set(jobs.map((job) => job.location))];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-white pb-20">
      <div className="absolute top-0 left-0 w-full h-60 bg-gradient-to-br from-blue-800 to-blue-500 rounded-b-3xl blur-[2px] opacity-60 pointer-events-none z-0" />
      <div className="max-w-6xl mx-auto px-4 py-16 z-10 relative">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 drop-shadow-lg animate-fade-in">
            <span className="text-blue-700">Careers</span> at Maindo Digital
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-lg font-medium">
            We’re looking for passionate people ready to build Africa’s digital future.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by title or location…"
            className="w-full md:w-1/2 border p-3 rounded-xl shadow-sm bg-white focus:ring-2 focus:ring-blue-400"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />

          <div className="flex gap-4">
            <select
              className="border p-3 rounded-xl shadow-sm bg-white"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
            <select
              className="border p-3 rounded-xl shadow-sm bg-white"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "newest" | "az");
                setCurrentPage(1);
              }}
            >
              <option value="newest">Sort by Newest</option>
              <option value="az">Sort A–Z</option>
            </select>
          </div>
        </div>

        {/* Job Cards */}
        <ul className="space-y-7">
          {paginatedJobs.map((job) => (
            <li
              key={job.id}
              className="group transition-all hover:scale-[1.025] hover:shadow-2xl shadow-lg border border-blue-100 bg-white/90 rounded-2xl p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2 mb-2">
                  <BriefcaseIcon className="h-6 w-6 text-blue-500" />
                  {job.title}
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-gray-400" />
                  {job.location}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(job)}
                className="inline-flex items-center gap-2 mt-5 sm:mt-0 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-semibold shadow hover:from-blue-700 hover:to-blue-500 transition"
              >
                {labels[language].apply}
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>

        {filteredJobs.length === 0 && (
          <p className="text-center text-gray-500 mt-16 animate-fade-in">
            No jobs match your criteria.
          </p>
        )}

        {/* Pagination */}
        {filteredJobs.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 rounded border border-blue-100 bg-white hover:bg-blue-50 disabled:opacity-40"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Previous
            </button>
            <span className="text-base text-gray-700">
              Page <b>{currentPage}</b> of <b>{totalPages}</b>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 rounded border border-blue-100 bg-white hover:bg-blue-50 disabled:opacity-40"
            >
              Next
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Application Modal */}
        <Transition appear show={selectedJob !== null} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={() => setSelectedJob(null)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-blue-950 bg-opacity-50 backdrop-blur-[2px]" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-200"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-150"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all animate-fade-in-up border border-blue-100">
                    <div className="flex justify-between items-center mb-2">
                      <Dialog.Title className="text-2xl font-extrabold text-blue-900">
                        {selectedJob?.title}
                      </Dialog.Title>
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="text-gray-400 hover:text-blue-500 rounded-full bg-gray-100 p-2"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
                    </div>
                    <p className="text-gray-600 mb-2 flex items-center gap-2">
                      <MapPinIcon className="h-5 w-5 text-blue-400" />
                      {selectedJob?.location}
                    </p>
                    <div className="prose max-w-none mb-6">
                      <h3 className="text-xl font-bold mt-4 mb-2 text-blue-800">Description</h3>
                      <div dangerouslySetInnerHTML={{ __html: selectedJob?.description || "" }} />
                      <h3 className="text-xl font-bold mt-6 mb-2 text-blue-800">Requirements</h3>
                      <div dangerouslySetInnerHTML={{ __html: selectedJob?.requirements || "" }} />
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">{labels[language].language}</label>
                          <select
                            className="border p-2 rounded w-full"
                            value={form.language}
                            onChange={(e) => {
                              const lang = e.target.value as "en" | "pt";
                              setForm((prev) => ({ ...prev, language: lang }));
                              setLanguage(lang);
                            }}
                          >
                            <option value="en">English</option>
                            <option value="pt">Português</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">{labels[language].fullName}</label>
                          <input
                            type="text"
                            className="w-full border p-2 rounded"
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">{labels[language].email}</label>
                          <input
                            type="email"
                            className="w-full border p-2 rounded"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">{labels[language].resume}</label>
                          <input
                            type="file"
                            accept="application/pdf"
                            className="w-full border p-2 rounded"
                            onChange={(e) => setForm({ ...form, resume: e.target.files?.[0] || null })}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">{labels[language].coverLetter}</label>
                        <textarea
                          className="w-full border p-2 rounded"
                          rows={4}
                          value={form.cover_letter}
                          onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow hover:from-blue-700 hover:to-blue-600 transition"
                        disabled={loading}
                      >
                        {labels[language].submit}
                      </button>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        {/* Loader */}
        <Transition
          show={loading}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
            <Lottie animationData={loaderLottie} loop style={{ width: 110 }} />
          </div>
        </Transition>

        {/* Success Toast */}
        <Transition
          show={applicationSent}
          as={Fragment}
          enter="transition-opacity duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-400"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-8 py-5 rounded-xl shadow-xl bg-green-600 text-white font-bold text-lg animate-fade-in-up">
            {labels[language].submitted}
          </div>
        </Transition>
      </div>
    </div>
  );
}
