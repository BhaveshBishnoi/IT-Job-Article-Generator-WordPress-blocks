'use client';
import { useState } from 'react';
import Image from "next/image";
import axios from 'axios';

export default function Home() {
  const [formData, setFormData] = useState<{
    [key: string]: string;
    companyName: string;
    position: string;
    experience: string;
    qualification: string;
    salary: string;
    workingDays: string;
    noticePeriod: string;
    companyOverview: string;
    aboutJobProfile: string;
    responsibilities: string;
    requirements: string;
    skills: string;
    hrEmail: string;
    applyLink: string;
    websiteLink: string;
  }>({
    companyName: '',
    position: '',
    experience: '',
    qualification: '',
    salary: '',
    workingDays: '',
    noticePeriod: '',
    companyOverview: '',
    aboutJobProfile: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    hrEmail: '',
    applyLink: '',
    websiteLink: ''
  });

  const [htmlOutput, setHtmlOutput] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Auto-generate content when company name or position changes
    if (name === 'companyName' && value.length > 2) {
      fetchDataFromGemini(value, formData.position);
    }
    if (name === 'position' && value.length > 2) {
      fetchDataFromGemini(formData.companyName, value);
    }
  };

  const fetchDataFromGemini = async (companyName: string, position: string) => {
    if (!companyName || !position) return;
    
    try {
      const companyOverviewResponse = await fetch(`/api/gemini?type=companyOverview&query=${encodeURIComponent(companyName)}`);
      const aboutJobProfileResponse = await fetch(`/api/gemini?type=aboutJobProfile&query=${encodeURIComponent(position)}`);
      const responsibilitiesResponse = await fetch(`/api/gemini?type=responsibilities&query=${encodeURIComponent(position)}`);
      const requirementsResponse = await fetch(`/api/gemini?type=requirements&query=${encodeURIComponent(position)}`);

      const [companyData, profileData, responsibilitiesData, requirementsData] = await Promise.all([
        companyOverviewResponse.json(),
        aboutJobProfileResponse.json(),
        responsibilitiesResponse.json(),
        requirementsResponse.json()
      ]);

      setFormData(prevData => ({
        ...prevData,
        companyOverview: companyData.content,
        aboutJobProfile: profileData.content,
        responsibilities: responsibilitiesData.content,
        requirements: requirementsData.content
      }));
    } catch (error) {
      console.error("Error fetching data from Gemini API:", error);
    }
  };

  const generateHtml = () => {
    // Convert asterisks to break tags for AI-generated content
    const formatContent = (content: string) => {
      return content.replace(/\*/g, '<br>');
    };

    const wpHTML = `
      <!-- wp:heading -->
      <h1>${formData.companyName} is Hiring ${formData.position} | Salary ${formData.salary}</h1>
      <!-- /wp:heading -->

      <!-- wp:paragraph -->
      <p >${formatContent(formData.companyOverview)}</p>
      <!-- /wp:paragraph -->

      <!-- wp:heading -->
      <h2>${formData.position} Hiring Details</h2>
      <!-- /wp:heading -->

      <!-- wp:table -->
      <table>
        <tbody>
          <tr>
            <td >Position Name</td>
            <td >${formData.position}</td>
          </tr>
          <tr>
            <td >Experience</td>
            <td >${formData.experience}</td>
          </tr>
          <tr>
            <td >Qualification</td>
            <td>${formData.qualification}</td>
          </tr>
          <tr>
            <td >Salary</td>
            <td>${formData.salary}</td>
          </tr>
          <tr>
            <td >Official Website</td>
            <td><a href="${formData.websiteLink}" target="_blank" rel="nofollow">${formData.companyName}</a></td>
          </tr>
          <tr>
            <td >Notice Period</td>
            <td>${formData.noticePeriod}</td>
          </tr>
          <tr>
            <td >Working Days</td>
            <td>${formData.workingDays}</td>
          </tr>
        </tbody>
      </table>
      <!-- /wp:table -->

      <!-- wp:heading -->
      <h2>About Job Profile</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph -->
      <p>${formatContent(formData.aboutJobProfile)}</p>
      <!-- /wp:paragraph -->

      <!-- wp:heading -->
      <h2>Responsibilities for ${formData.position}</h2>
      <!-- /wp:heading -->

      <!-- wp:list -->
      <ul>
        ${formData.responsibilities}
      </ul>
      <!-- /wp:list -->

      <!-- wp:heading -->
      <h2>Requirements</h2>
      <!-- /wp:heading -->

      <!-- wp:list -->
      <ul>
        ${formData.requirements}
      </ul>
      <!-- /wp:list -->

      <!-- wp:heading -->
      <h2>Skills Required</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph -->
      <p>To excel in this role, candidates should possess a strong foundation in principles and a keen eye for detail. It would be best if you had strong proficiency in the following skills to grab this opportunity.</p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph -->
      <p>
        ${formData.skills}
      </p>
      <!-- /wp:paragraph -->

      <!-- wp:heading -->
      <h2>How to Apply</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph -->
      <p>Contact Email Address - <a href="mailto:${formData.hrEmail}" >${formData.hrEmail}</a></p>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph -->
      <a href="${formData.applyLink}" target='_blank'><button>Apply Now</button></a>
      <!-- /wp:paragraph -->

      <!-- wp:paragraph -->
      <p>For any queries, feel free to reach out at <a href="mailto:${formData.hrEmail}" >${formData.hrEmail}</a>. We're here to help you every step of the way.</p>
      <!-- /wp:paragraph -->
    `;

    setHtmlOutput(wpHTML);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Job Article Generator</h2>
          <form className="space-y-4">
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label htmlFor={key} className="block mb-2 text-sm font-semibold">
                  {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </label>
                <textarea
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 border border-gray-600 rounded bg-gray-700 text-white resize-none"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={generateHtml}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Generate HTML
            </button>
          </form>
        </div>

        {/* Output Section */}
        <div className="w-full lg:w-1/2 p-6 bg-gray-900 text-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Generated HTML</h2>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
            onClick={() => navigator.clipboard.writeText(htmlOutput)}
          >
            Copy HTML
          </button>
          <div className="bg-gray-800 p-4 rounded overflow-x-auto">
            <pre className="whitespace-pre-wrap">{htmlOutput}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
