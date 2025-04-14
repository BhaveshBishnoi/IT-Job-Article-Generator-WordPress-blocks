"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
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

  const [htmlOutput, setHtmlOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (
      name === "companyName" &&
      value.trim().length > 2 &&
      formData.position.trim().length > 2
    ) {
      fetchDataFromGemini(value, formData.position);
    }
    if (
      name === "position" &&
      value.trim().length > 2 &&
      formData.companyName.trim().length > 2
    ) {
      fetchDataFromGemini(formData.companyName, value);
    }
  };

  const fetchDataFromGemini = async (companyName: string, position: string) => {
    if (!companyName || !position) return;

    setIsLoading(true);
    setError(null);

    try {
      const endpoints = [
        { type: "companyOverview", query: companyName },
        { type: "aboutJobProfile", query: position },
        { type: "responsibilities", query: position },
        { type: "requirements", query: position },
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          fetch(
            `/api/gemini?type=${endpoint.type}&query=${encodeURIComponent(
              endpoint.query
            )}`
          ).then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(
                errorData.message || `Request failed with status ${res.status}`
              );
            }
            return res.json();
          })
        )
      );

      setFormData((prev) => ({
        ...prev,
        companyOverview: responses[0].content || "",
        aboutJobProfile: responses[1].content || "",
        responsibilities: responses[2].content || "",
        requirements: responses[3].content || "",
      }));
    } catch (error) {
      console.error("Error in fetchDataFromGemini:", error);
      setError(
        `Failed to fetch data: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (content: string, isList = false) => {
    if (!content) return "";

    if (isList) {
      return content
        .split("*")
        .filter(Boolean)
        .map((line) => `<li>${line.trim()}</li>`)
        .join("");
    }
    return content.replace(/\n/g, "<br>");
  };

  const generateHtml = () => {
    if (!formData.companyName || !formData.position) {
      setError("Company name and position are required");
      return;
    }

    const wpHTML = `
      <!-- wp:heading -->
      <h1>${formData.companyName} is Hiring ${formData.position} | Salary ${
      formData.salary || "Not specified"
    }</h1>
      <!-- /wp:heading -->

      <!-- wp:paragraph -->
      <p>${
        formatContent(formData.companyOverview) ||
        "No company overview available"
      }</p>
      <!-- /wp:paragraph -->

      <!-- wp:heading -->
      <h2>${formData.position} Hiring Details</h2>
      <!-- /wp:heading -->

      <!-- wp:table -->
      <table>
        <tbody>
          <tr><td>Position Name</td><td>${formData.position}</td></tr>
          <tr><td>Experience</td><td>${
            formData.experience || "Not specified"
          }</td></tr>
          <tr><td>Location</td><td>${
            formData.location || "Not specified"
          }</td></tr>
          <tr><td>Qualification</td><td>${
            formData.qualification || "Not specified"
          }</td></tr>
          <tr><td>Salary</td><td>${formData.salary || "Not specified"}</td></tr>
          <tr><td>Official Website</td><td>${
            formData.websiteLink
              ? `<a href="${formData.websiteLink}" target="_blank" rel="nofollow">${formData.companyName}</a>`
              : "Not available"
          }</td></tr>
          <tr><td>Working Days</td><td>${
            formData.workingDays || "Not specified"
          }</td></tr>
        </tbody>
      </table>
      <!-- /wp:table -->

      <!-- wp:heading -->
      <h2>About Job Profile</h2>
      <!-- /wp:heading -->
      <p>${
        formatContent(formData.aboutJobProfile) ||
        "No job profile information available"
      }</p>

      <!-- wp:heading -->
      <h2>Responsibilities for ${formData.position}</h2>
      <!-- /wp:heading -->
      <ul>${
        formatContent(formData.responsibilities, true) ||
        "<li>No responsibilities listed</li>"
      }</ul>

      <!-- wp:heading -->
      <h2>Requirements</h2>
      <!-- /wp:heading -->
      <ul>${
        formatContent(formData.requirements, true) ||
        "<li>No requirements specified</li>"
      }</ul>

      <!-- wp:heading -->
      <h2>Skills Required</h2>
      <!-- /wp:heading -->
      <p>${formatContent(formData.skills) || "No specific skills mentioned"}</p>

      <!-- wp:heading -->
      <h2>How to Apply</h2>
      <!-- /wp:heading -->
      <p>Contact Email: ${
        formData.hrEmail
          ? `<a href="mailto:${formData.hrEmail}">${formData.hrEmail}</a>`
          : "Not provided"
      }</p>
      ${
        formData.applyLink
          ? `<a href="${formData.applyLink}" target='_blank'><button>Apply Now</button></a>`
          : "<p>No application link provided</p>"
      }
    `;

    setHtmlOutput(wpHTML);
    setError(null);
  };

  const handleCopy = async () => {
    try {
      if (!htmlOutput) {
        setError("No HTML to copy");
        return;
      }
      await navigator.clipboard.writeText(htmlOutput);
      alert("HTML copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
      setError("Failed to copy HTML to clipboard");
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/2 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Job Article Generator</h2>

          {isLoading && (
            <div className="mb-4 p-3 bg-blue-900 text-blue-100 rounded">
              Fetching AI-generated content...
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-100 rounded">
              {error}
            </div>
          )}

          <form className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block mb-2 text-sm font-semibold"
                >
                  {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                </label>
                <textarea
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white resize-none"
                  disabled={
                    isLoading &&
                    [
                      "companyOverview",
                      "aboutJobProfile",
                      "responsibilities",
                      "requirements",
                    ].includes(key)
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={generateHtml}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Generate HTML"}
            </button>
          </form>
        </div>
        <div className="w-full lg:w-1/2 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Generated HTML</h2>
          {isMounted && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4 disabled:bg-gray-500"
              onClick={handleCopy}
              disabled={!htmlOutput || isLoading}
            >
              Copy HTML
            </button>
          )}
          <div className="bg-gray-800 p-4 rounded overflow-x-auto">
            {htmlOutput ? (
              <pre className="whitespace-pre-wrap">{htmlOutput}</pre>
            ) : (
              <p className="text-gray-400">Generated HTML will appear here</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
