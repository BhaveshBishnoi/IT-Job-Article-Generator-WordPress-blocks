"use client";

import { useState } from "react";
import {
  Copy,
  Download,
  RefreshCw,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Link,
} from "lucide-react";

export default function HiringPromptGenerator() {
  const [formData, setFormData] = useState({
    companyName: "",
    position: "",
    experience: "",
    salary: "",
    jobLocation: "",
    companyWebsite: "",
    jobPostLink: "",
  });

  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generatePrompt = () => {
    const prompt = `**Prompt Template for Assistant:**

> Task:
> You are an expert content creator specializing in recruitment content. Create a high-converting, SEO-optimized hiring article in WP-block format, comparable in style and detail to premium job portals like openhiring.in's featured posts. Structure it for maximum clarity, engagement, and search engine appeal while maintaining professional credibility.

> Input Details:
> - Company Name: ${formData.companyName || "[TO_BE_EXTRACTED]"}
> - Job Position: ${formData.position || "[TO_BE_EXTRACTED]"}
> - Experience Required: ${formData.experience || "[TO_BE_EXTRACTED]"}
> - Salary Range: ${formData.salary || "[TO_BE_EXTRACTED]"}
> - Job Location: ${formData.jobLocation || "[TO_BE_EXTRACTED]"}
> - Company Website: ${formData.companyWebsite || "[TO_BE_EXTRACTED]"}
> - Source Job Post/LinkedIn Link: ${
      formData.jobPostLink || "[PASTE_LINK_HERE]"
    }

> Research Instructions:
> **CRITICAL:** Access the provided job post link and extract comprehensive information including:
> - Complete job description and requirements
> - Company background, culture, and values
> - Application process and deadlines
> - Benefits, perks, and compensation details
> - Required qualifications and preferred skills
> - Team structure and reporting relationships
> - Growth opportunities and career progression

> Article rules for AI 

Must send articles in wp-block code formet and also don't send any refrence links that used for research just text and only hiring company website link will provided in article

Must send detailed Catchy Title targeting Google Discover that is clickable just after reading

> Article Structure & Format:

**Introduction Paragraph:**
Create an engaging opening that introduces the company and position, highlighting key attractions for potential candidates. Include the company name, job role, and location naturally for SEO.

**1. Company Overview**
- Research and summarize comprehensive company information
- Include: headquarters/locations, company vision/mission, employee size, industry segment
- Highlight unique selling points, recent achievements, and market position
- Mention company culture, values, and what makes it an attractive employer

**2. Job Role Introduction**
- Clearly define the position title and primary purpose
- Explain the role's importance within the organization
- Appeal directly to ideal candidates with compelling value propositions
- Include career growth potential and learning opportunities

**3. Key Responsibilities & Impact**
- Extract and organize main job duties into clear bullet points
- Focus on meaningful contributions and expected impact
- Highlight collaborative aspects and cross-functional work
- Include any leadership or mentoring responsibilities

**4. Comprehensive Job Details Table**
Create a detailed table with extracted information:

| Attribute | Details |
|-----------|---------|
| Company Name | ${formData.companyName || "[Extract from post]"} |
| Company Website | ${formData.companyWebsite || "[Extract from post]"} |
| Job Role | ${formData.position || "[Extract from post]"} |
| Work Location | ${formData.jobLocation || "[Extract from post]"} |
| Work Mode | [Extract: Remote/Hybrid/On-site] |
| Job Type | [Extract: Full-time/Contract/Internship] |
| Experience Required | ${formData.experience || "[Extract from post]"} |
| Qualification | [Extract minimum education requirements] |
| Preferred Batch | [Extract if mentioned] |
| Salary Range | ${formData.salary || "[Extract from post]"} |
| Application Deadline | [Extract from post] |
| Expected Joining | [Extract from post] |
| Service Agreement | [Extract if mentioned] |
| Reporting To | [Extract from post] |
| Team Size | [Extract if mentioned] |

**5. Skills & Qualifications**
**Must-Have Skills:**
- List essential technical and soft skills
- Include specific technologies, tools, or methodologies

**Preferred Qualifications:**
- Additional skills that would be advantageous
- Certifications or specialized knowledge
- Industry-specific experience

**Soft Skills:**
- Communication, leadership, and collaboration abilities
- Problem-solving and analytical thinking
- Adaptability and learning mindset

**6. Application Process**
- Step-by-step application instructions
- Required documents (resume, portfolio, certificates)
- Interview process overview
- Timeline and next steps
- Contact information for queries

**7. Why Join ${formData.companyName || "[Company Name]"}?**
- Extract unique benefits and perks
- Professional development opportunities
- Work-life balance initiatives
- Company culture highlights
- Career progression pathways

**8. Additional Information**
- Any special selection procedures
- Training and onboarding process
- Performance evaluation criteria
- Company policies and values alignment

> SEO Optimization Requirements:

**Primary Keywords to Include:**
- "${formData.position || "[Position]"} jobs"
- "${formData.companyName || "[Company]"} careers" 
- "${formData.position || "[Position]"} roles ${
      formData.jobLocation || "[Location]"
    }"
- "${formData.position || "[Position]"} openings India"
- "${formData.companyName || "[Company]"} recruitment 2024"

**Content Guidelines:**
- Write an engaging, click-worthy title (60-65 characters)
- Create compelling meta description (150-160 characters)
- Use proper heading hierarchy (H1, H2, H3) with target keywords
- Include location-based keywords naturally throughout
- Add engaging calls-to-action in each section
- Ensure keyword density of 1-2% for primary terms
- Write in active voice with varied sentence structure

**Technical Requirements:**
- Format for WordPress block editor
- Use proper HTML tags and structure
- Include schema markup suggestions
- Optimize for mobile readability
- Add internal linking opportunities

> Final Output Requirements:
- Complete WP-block structured article (2000-2500 words)
- Ready for direct publishing without editing
- All information sourced from the provided job post link
- No external links unless specifically mentioned in source
- Professional, engaging tone throughout
- Include relevant industry context and trends
- Add compelling conclusion with clear call-to-action

> Quality Checklist:
✓ All sections completed with substantial, unique content
✓ No repetitive or redundant information
✓ SEO keywords naturally integrated
✓ Professional formatting and structure
✓ Accurate information extracted from source
✓ Engaging and conversion-focused copy
✓ Ready for immediate publication

**Important:** Research the provided job post link thoroughly and ensure all details are accurately reflected in the article. Do not use placeholder text - extract real information from the source.`;

    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const downloadPrompt = () => {
    const element = document.createElement("a");
    const file = new Blob([generatedPrompt], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `hiring-prompt-${
      formData.companyName || "template"
    }.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearForm = () => {
    setFormData({
      companyName: "",
      position: "",
      experience: "",
      salary: "",
      jobLocation: "",
      companyWebsite: "",
      jobPostLink: "",
    });
    setGeneratedPrompt("");
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Background decorations */}

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-lg opacity-75"></div>
                <div className="relative p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl">
                  <Briefcase className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  AI Prompt Generator
                </h1>
                <div className="text-xl font-semibold text-purple-300">
                  For Professional Hiring Articles
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Transform any job posting into compelling, SEO-optimized hiring
              articles with our advanced AI prompt generator. Trusted by HR
              professionals worldwide.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
                ✨ AI-Powered
              </span>
              <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30">
                🚀 SEO Optimized
              </span>
              <span className="px-4 py-2 bg-pink-500/20 text-pink-300 rounded-full text-sm font-medium border border-pink-500/30">
                📊 Professional Format
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  Job Information
                  <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </h2>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="group">
                      <label className=" text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-blue-400" />
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="e.g., Hexaware Technologies"
                        className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-white/30 focus:bg-white/10"
                      />
                    </div>

                    <div className="group">
                      <label className=" text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-400" />
                        Job Position
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="e.g., Senior React Developer"
                        className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-white/30 focus:bg-white/10"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label className=" text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-400" />
                      Experience Required
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 3-5 years"
                      className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-green-400/50 focus:border-green-400/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-white/30 focus:bg-white/10"
                    />
                  </div>

                  <div className="group">
                    <label className=" text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-yellow-400" />
                      Salary Range
                    </label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g., ₹8-12 LPA"
                      className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-white/30 focus:bg-white/10"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="group">
                    <label className=" text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-400" />
                      Job Location
                    </label>
                    <input
                      type="text"
                      name="jobLocation"
                      value={formData.jobLocation}
                      onChange={handleInputChange}
                      placeholder="e.g., Mumbai, Pune"
                      className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-red-400/50 focus:border-red-400/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-white/30 focus:bg-white/10"
                    />
                  </div>

                  <div className="group">
                    <label className=" text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-indigo-400" />
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleInputChange}
                      placeholder="e.g., https://hexaware.com"
                      className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-white/30 focus:bg-white/10"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className=" text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                    <Link className="w-4 h-4 text-pink-400" />
                    Job Post / LinkedIn URL *
                    <span className="ml-auto text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                      Required
                    </span>
                  </label>
                  <textarea
                    name="jobPostLink"
                    value={formData.jobPostLink}
                    onChange={handleInputChange}
                    placeholder="Paste the LinkedIn job post URL or any job posting link here..."
                    rows={4}
                    className="w-full p-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-pink-400/50 focus:border-pink-400/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-white/30 focus:bg-white/10 resize-none"
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink-400 rounded-full"></span>
                    This link will be used to research and extract detailed job
                    information
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={generatePrompt}
                    disabled={!formData.jobPostLink}
                    className="flex-1 relative group overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-8 rounded-2xl font-bold hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 disabled:hover:scale-100 disabled:hover:translate-y-0"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      <Briefcase className="w-5 h-5" />
                      Generate AI Prompt
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                  </button>

                  <button
                    onClick={clearForm}
                    className="px-6 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center gap-3 text-gray-300 hover:text-white group"
                  >
                    <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Generated Prompt Display */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 hover:border-white/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl shadow-lg">
                      <Copy className="w-6 h-6 text-white" />
                    </div>
                    Generated Prompt
                    {generatedPrompt && (
                      <div className="flex items-center gap-2 ml-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-green-400 font-medium">
                          Ready
                        </span>
                      </div>
                    )}
                  </h2>

                  {generatedPrompt && (
                    <div className="flex gap-3">
                      <button
                        onClick={copyToClipboard}
                        className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                          copied
                            ? "bg-green-500/20 text-green-300 border border-green-500/30 scale-105"
                            : "bg-white/5 backdrop-blur-sm text-gray-300 hover:text-white border border-white/20 hover:border-white/30 hover:bg-white/10"
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied!" : "Copy"}
                      </button>

                      <button
                        onClick={downloadPrompt}
                        className="px-6 py-3 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-2xl hover:bg-blue-500/30 hover:border-blue-500/40 transition-all duration-300 flex items-center gap-2 group"
                      >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        Download
                      </button>
                    </div>
                  )}
                </div>

                {generatedPrompt ? (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
                    <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-6 max-h-96 overflow-y-auto border border-white/10 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent hover:scrollbar-thumb-white/30">
                      <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed selection:bg-blue-500/30">
                        {generatedPrompt}
                      </pre>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-4 right-4 text-xs text-gray-400 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                      <span className="animate-pulse">
                        ⬇ Scroll to read more
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-400">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                      <div className="relative p-8 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 inline-block">
                        <Briefcase className="w-16 h-16 text-gray-500" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      Ready to Generate
                    </h3>
                    <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
                      Fill in the job information and click `Generate AI Prompt`
                      to create your custom hiring article prompt with advanced
                      AI instructions.
                    </p>

                    {/* Progress indicator */}
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          formData.jobPostLink ? "bg-green-400" : "bg-gray-600"
                        }`}
                      ></div>
                      <div className="w-8 h-px bg-gradient-to-r from-gray-600 to-gray-500"></div>
                      <div
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          generatedPrompt ? "bg-green-400" : "bg-gray-600"
                        }`}
                      ></div>
                      <div className="w-8 h-px bg-gradient-to-r from-gray-600 to-gray-500"></div>
                      <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl"></div>
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Powered by Advanced AI
                  </h3>
                  <div className="flex gap-2">
                    <div
                      className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  </div>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  This tool generates comprehensive prompts for AI assistants to
                  create professional hiring articles. Perfect for HR teams,
                  recruiters, and content creators looking to streamline their
                  job posting process with cutting-edge AI technology.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      ⚡
                    </div>
                    <div className="text-sm text-gray-400">Lightning Fast</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      🎯
                    </div>
                    <div className="text-sm text-gray-400">SEO Optimized</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400 mb-1">
                      🚀
                    </div>
                    <div className="text-sm text-gray-400">
                      Professional Grade
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
