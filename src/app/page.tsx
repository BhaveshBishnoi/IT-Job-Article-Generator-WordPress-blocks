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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [generatedSections, setGeneratedSections] = useState({
    companyOverview: false,
    aboutJobProfile: false,
    responsibilities: false,
    requirements: false,
  });

  const [loadingStates, setLoadingStates] = useState({
    companyOverview: false,
    aboutJobProfile: false,
    responsibilities: false,
    requirements: false,
    generatingPost: false,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = async (field: keyof FormData, value: string) => {
    if (value.trim().length < 3) return;

    if (
      field === "companyName" &&
      value &&
      !generatedSections.companyOverview
    ) {
      await generateWithGemini(
        "companyOverview",
        `Write a 3-paragraph professional overview for ${value} company. Focus on company history, mission, and values. also rewrite content in easy and human language.`
      );
    }

    if (field === "position" && value && !generatedSections.aboutJobProfile) {
      await generateWithGemini(
        "aboutJobProfile",
        `Write a detailed job profile description for a ${value} position. Include what the role entails and its importance in the company. also rewrite content in easy and human language.`
      );
      await generateWithGemini(
        "responsibilities",
        `Create a bullet point list of key responsibilities for a ${value} position. Make each point concise but descriptive. also rewrite content in easy and human language.`
      );
      await generateWithGemini(
        "requirements",
        `Create a bullet point list of requirements for a ${value} position. Include education, experience, and certifications if needed. also rewrite content in easy and human language.`
      );
    }
  };

  const generateWithGemini = async (field: keyof FormData, prompt: string) => {
    setLoadingStates((prev) => ({ ...prev, [field]: true }));
    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate content");
      }

      setFormData((prev) => ({ ...prev, [field]: data.text }));
      setGeneratedSections((prev) => ({ ...prev, [field]: true }));
    } catch (err) {
      setError(
        `Failed to generate ${field
          .replace(/([A-Z])/g, " $1")
          .toLowerCase()}: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoadingStates((prev) => ({ ...prev, [field]: false }));
    }
  };

  const generateWpBlockPost = async () => {
    if (!formData.companyName || !formData.position) {
      setError("Company name and position are required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

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
        8. How to apply section Add Apply Now Button
      - Make sure the content is SEO optimized
      - Use clean, professional language`;

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate content");
      }

      setWpBlockOutput(data.text);
      setSuccessMessage("Job post generated successfully!");
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
      setSuccessMessage("Copied to clipboard!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const renderInputField = (
    name: keyof FormData,
    type: "text" | "textarea" = "text",
    rows = 1
  ) => {
    const isTextarea = type === "textarea";
    const InputComponent = isTextarea ? "textarea" : "input";
    const isLoading = loadingStates[name as keyof typeof loadingStates];
    const isRequired = ["companyName", "position"].includes(name);

    return (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-300">
          {formatLabel(name)}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        <InputComponent
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onBlur={(e) => handleBlur(name, e.target.value)}
          type={!isTextarea ? type : undefined}
          rows={isTextarea ? rows : undefined}
          disabled={isLoading}
          className={`w-full p-3 bg-gray-700 border ${
            isRequired && !formData[name].trim()
              ? "border-red-500"
              : "border-gray-600"
          } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        />
        {isLoading && (
          <div className="text-xs text-blue-400 flex items-center">
            <svg
              className="animate-spin h-3 w-3 mr-1"
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
          </div>
        )}
      </div>
    );
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

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-6 text-blue-400">
              Job Details
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded border border-red-700 flex justify-between items-center">
                <span>{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="text-red-300 hover:text-white"
                >
                  ×
                </button>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-green-900/50 text-green-200 rounded border border-green-700">
                {successMessage}
              </div>
            )}

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputField("companyName")}
                {renderInputField("position")}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputField("experience")}
                {renderInputField("qualification")}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputField("salary")}
                {renderInputField("workingDays")}
              </div>

              {renderInputField("location")}
              {renderInputField("companyOverview", "textarea", 4)}
              {renderInputField("aboutJobProfile", "textarea", 4)}
              {renderInputField("responsibilities", "textarea", 4)}
              {renderInputField("requirements", "textarea", 4)}
              {renderInputField("skills", "textarea", 3)}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderInputField("applyLink")}
                {renderInputField("hrEmail")}
              </div>

              {renderInputField("websiteLink")}

              <button
                onClick={generateWpBlockPost}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-md font-medium transition flex items-center justify-center ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isLoading ? (
                  <>
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
                  </>
                ) : (
                  "Generate WordPress Post"
                )}
              </button>
            </div>
          </div>

          {/* Output Preview */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 flex flex-col">
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

            <div className="bg-gray-900 p-4 rounded-md border border-gray-700 flex-grow overflow-hidden">
              {wpBlockOutput ? (
                <pre className="whitespace-pre-wrap text-sm font-mono text-gray-300 h-full overflow-auto">
                  {wpBlockOutput}
                </pre>
              ) : (
                <div className="text-center py-10 text-gray-500 h-full flex flex-col items-center justify-center">
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
