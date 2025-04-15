"use client";

import { useState, useEffect } from "react";

type FormData = {
  companyName: string;
  position: string;
  experience: string;
  qualification: string;
  salary: string;
  workingDays: string;
  location: string;
  companyOverview: string;
  aboutJobProfile: string;
  responsibilities: string;
  requirements: string;
  skills: string;
  hrEmail: string;
  applyLink: string;
  websiteLink: string;
};

export default function JobPostGenerator() {
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    position: "",
    experience: "",
    qualification: "",
    salary: "",
    workingDays: "",
    location: "",
    companyOverview: "",
    aboutJobProfile: "",
    responsibilities: "",
    requirements: "",
    skills: "",
    hrEmail: "",
    applyLink: "",
    websiteLink: "",
  });

  const [wpBlockOutput, setWpBlockOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [generatedSections, setGeneratedSections] = useState({
    companyOverview: false,
    aboutJobProfile: false,
    responsibilities: false,
    requirements: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = async (field: keyof FormData, value: string) => {
    if (value.trim().length < 3) return;

    // Auto-generate sections when company name or position is filled
    if (field === "companyName" && value && !generatedSections.companyOverview) {
      await generateWithGemini(
        "companyOverview",
        `Write a 3-paragraph professional overview for ${value} company. Focus on company history, mission, and values.`
      );
    }

    if (field === "position" && value && !generatedSections.aboutJobProfile) {
      await generateWithGemini(
        "aboutJobProfile",
        `Write a detailed job profile description for a ${value} position. Include what the role entails and its importance in the company.`
      );
      await generateWithGemini(
        "responsibilities",
        `Create a bullet point list of key responsibilities for a ${value} position. Make each point concise but descriptive.`
      );
      await generateWithGemini(
        "requirements",
        `Create a bullet point list of requirements for a ${value} position. Include education, experience, and certifications if needed.`
      );
    }
  };

  const generateWithGemini = async (field: keyof FormData, prompt: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setFormData((prev) => ({ ...prev, [field]: data.text }));
      setGeneratedSections((prev) => ({ ...prev, [field]: true }));
    } catch (err) {
      setError(
        `Failed to generate ${field.replace(/([A-Z])/g, " $1").toLowerCase()}: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateWpBlockPost = async () => {
    if (!formData.companyName || !formData.position) {
      setError("Company name and position are required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const prompt = `Create a professional WordPress post in block editor format about this job opening:
      - Company: ${formData.companyName}
      - Position: ${formData.position}
      - Experience: ${formData.experience}
      - Location: ${formData.location}
      - Qualification: ${formData.qualification}
      - Salary: ${formData.salary}
      - Working Days: ${formData.workingDays}
      - Company Overview: ${formData.companyOverview}
      - Job Profile: ${formData.aboutJobProfile}
      - Responsibilities: ${formData.responsibilities}
      - Requirements: ${formData.requirements}
      - Skills: ${formData.skills}
      - Apply Link: ${formData.applyLink}
      - HR Email: ${formData.hrEmail}
      - Website: ${formData.websiteLink}

      Format requirements:
      - Use proper WordPress block syntax (Gutenberg)
      - Include headings, paragraphs, lists, and tables where appropriate
      - Structure should be: 
        1. Main heading with company name and position
        2. Company overview section
        3. Job details table
        4. Job profile description
        5. Responsibilities list
        6. Requirements list
        7. Skills section
        8. How to apply section
      - Make sure the content is SEO optimized
      - Use clean, professional language`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setWpBlockOutput(data.text);
    } catch (err) {
      setError(
        `Failed to generate WordPress post: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wpBlockOutput);
      alert("WordPress block code copied to clipboard!");
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">
            Job Post Generator
          </h1>
          <p className="text-gray-400">
            Create professional WordPress job postings with AI assistance
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">
              Job Details
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-700">
                {error}
                <button
                  onClick={() => setError(null)}
                  className="float-right text-red-300 hover:text-white"
                >
                  ×
                </button>
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur("companyName", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    disabled={isLoading && generatedSections.companyOverview}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Position
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur("position", e.target.value)}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                    disabled={isLoading && generatedSections.aboutJobProfile}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Qualification
                  </label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Working Days
                  </label>
                  <input
                    type="text"
                    name="workingDays"
                    value={formData.workingDays}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Company Overview
                </label>
                <textarea
                  name="companyOverview"
                  value={formData.companyOverview}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  disabled={isLoading && generatedSections.companyOverview}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  About Job Profile
                </label>
                <textarea
                  name="aboutJobProfile"
                  value={formData.aboutJobProfile}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  disabled={isLoading && generatedSections.aboutJobProfile}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Responsibilities
                </label>
                <textarea
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  disabled={isLoading && generatedSections.responsibilities}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Requirements
                </label>
                <textarea
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  disabled={isLoading && generatedSections.requirements}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Skills
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Apply Link
                  </label>
                  <input
                    type="text"
                    name="applyLink"
                    value={formData.applyLink}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    HR Email
                  </label>
                  <input
                    type="text"
                    name="hrEmail"
                    value={formData.hrEmail}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">
                  Website Link
                </label>
                <input
                  type="text"
                  name="websiteLink"
                  value={formData.websiteLink}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100"
                />
              </div>

              <button
                onClick={generateWpBlockPost}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-md font-medium transition ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  "Generate WordPress Post"
                )}
              </button>
            </div>
          </div>

          {/* Output Preview */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-blue-400">
                WordPress Block Output
              </h2>
              {isMounted && wpBlockOutput && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy All
                </button>
              )}
            </div>

            <div className="bg-gray-900 p-4 rounded-md border border-gray-700">
              {wpBlockOutput ? (
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300 overflow-auto max-h-[70vh]">
                  {wpBlockOutput}
                </pre>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto mb-3 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p>Your WordPress block code will appear here</p>
                  <p className="text-sm mt-1">
                    Fill in the form and click `Generate WordPress Post`
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}