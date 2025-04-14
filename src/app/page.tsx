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

export default function Home() {
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

  const [htmlOutput, setHtmlOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (name: string, value: string) => {
    if (name === "companyName" && value && formData.position) {
      fetchDataFromGemini(value, formData.position);
    }
    if (name === "position" && value && formData.companyName) {
      fetchDataFromGemini(formData.companyName, value);
    }
  };

  const fetchDataFromGemini = async (companyName: string, position: string) => {
    if (!companyName.trim() || !position.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const types = [
        "companyOverview",
        "aboutJobProfile",
        "responsibilities",
        "requirements",
      ];

      const responses = await Promise.all(
        types.map((type) =>
          fetch(
            `/api/gemini?type=${type}&query=${
              type === "companyOverview"
                ? encodeURIComponent(companyName)
                : encodeURIComponent(position)
            }`
          )
            .then((res) => {
              if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
              return res.json();
            })
            .then((data) => {
              if (data.error) throw new Error(data.error);
              return data.content;
            })
        )
      );

      setFormData((prev) => ({
        ...prev,
        companyOverview: responses[0] || "",
        aboutJobProfile: responses[1] || "",
        responsibilities: responses[2] || "",
        requirements: responses[3] || "",
      }));
    } catch (error) {
      console.error("API Error:", error);
      setError(
        `Failed to fetch data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const generateHtml = () => {
    if (!formData.companyName || !formData.position) {
      setError("Company name and position are required");
      return;
    }

    const wpHTML = `
      <!-- wp:heading -->
      <h1>${formData.companyName} is Hiring ${formData.position}</h1>
      <!-- /wp:heading -->

      ${
        formData.companyOverview ||
        "<!-- wp:paragraph --><p>No company overview available</p><!-- /wp:paragraph -->"
      }

      <!-- wp:heading -->
      <h2>Job Details</h2>
      <!-- /wp:heading -->

      <!-- wp:table -->
      <table>
        <tbody>
          ${[
            ["Position", formData.position],
            ["Experience", formData.experience || "Not specified"],
            ["Location", formData.location || "Not specified"],
            ["Qualification", formData.qualification || "Not specified"],
            ["Salary", formData.salary || "Not specified"],
            [
              "Website",
              formData.websiteLink
                ? `<a href="${formData.websiteLink}" target="_blank">${formData.companyName}</a>`
                : "Not available",
            ],
            ["Working Days", formData.workingDays || "Not specified"],
          ]
            .map(
              ([label, value]) => `
            <tr>
              <td>${label}</td>
              <td>${value}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <!-- /wp:table -->

      <!-- wp:heading -->
      <h2>About the Role</h2>
      <!-- /wp:heading -->
      ${
        formData.aboutJobProfile ||
        "<!-- wp:paragraph --><p>No job description available</p><!-- /wp:paragraph -->"
      }

      <!-- wp:heading -->
      <h2>Responsibilities</h2>
      <!-- /wp:heading -->
      ${
        formData.responsibilities ||
        "<!-- wp:list --><ul><li>No responsibilities listed</li></ul><!-- /wp:list -->"
      }

      <!-- wp:heading -->
      <h2>Requirements</h2>
      <!-- /wp:heading -->
      ${
        formData.requirements ||
        "<!-- wp:list --><ul><li>No requirements specified</li></ul><!-- /wp:list -->"
      }

      ${
        formData.skills
          ? `
        <!-- wp:heading -->
        <h2>Skills</h2>
        <!-- /wp:heading -->
        <!-- wp:paragraph -->
        <p>${formData.skills.replace(/\n/g, "<br>")}</p>
        <!-- /wp:paragraph -->
      `
          : ""
      }

      <!-- wp:heading -->
      <h2>How to Apply</h2>
      <!-- /wp:heading -->
      <!-- wp:paragraph -->
      <p>${
        formData.hrEmail
          ? `Contact: <a href="mailto:${formData.hrEmail}">${formData.hrEmail}</a>`
          : "No contact provided"
      }</p>
      <!-- /wp:paragraph -->
      ${
        formData.applyLink
          ? `
        <!-- wp:buttons -->
        <div>
          <a href="${formData.applyLink}" class="wp-block-button__link">Apply Now</a>
        </div>
        <!-- /wp:buttons -->
      `
          : ""
      }
    `;

    setHtmlOutput(wpHTML.replace(/\n/g, "").replace(/  +/g, " ").trim());
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
      console.error("Copy failed:", err);
      setError("Failed to copy HTML");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Job Posting Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.split(/(?=[A-Z])/).join(" ")}
                  </label>
                  <textarea
                    name={key}
                    value={value}
                    onChange={handleChange}
                    onBlur={(e) => handleBlur(key, e.target.value)}
                    rows={3}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
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
                onClick={generateHtml}
                disabled={isLoading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLoading ? "Generating..." : "Generate HTML"}
              </button>
            </div>
          </div>

          {/* Output Preview */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated HTML</h2>
              {isMounted && (
                <button
                  onClick={handleCopy}
                  disabled={!htmlOutput || isLoading}
                  className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  Copy
                </button>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded border">
              {htmlOutput ? (
                <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-[600px]">
                  {htmlOutput}
                </pre>
              ) : (
                <p className="text-gray-500 italic">
                  Generated HTML will appear here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
