// /src/services/courseData.js

// This file is the "Single Source of Truth" for all detailed course curricula.
// It provides the rich data needed for our high-converting sales pages.

const detailedCourseData = [
    {
        id: "cm-1",
        title: "AI for Content & Marketing Masterclass",
        subtitle: "A complete A-Z guide on leveraging generative AI to 10x your content output, quality, and marketing ROI.",
        category: "Content & Marketing",
        level: "Beginner",
        duration: "8 Hours of Video",
        price: 299,
        imageUrl: "https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        learningOutcomes: "In this masterclass, you will go from zero experience to confidently using AI for idea generation, copywriting, creating photorealistic images, and producing short-form video content. You'll leave with a portfolio of AI-generated assets and a repeatable workflow for your business or personal brand.",
        modules: [
            {
                title: "Module 1: The Creative AI Revolution",
                lessons: [
                    "Understanding Generative Models (LLMs, Diffusion)",
                    "The Art of the Prompt: Core Principles for Creatives",
                    "Setting Up Your Essential AI Toolkit",
                    "Ethical Considerations for AI Content Creation"
                ]
            },
            {
                title: "Module 2: AI-Powered Copywriting & SEO",
                lessons: [
                    "Generating Viral Blog Post Ideas and Outlines",
                    "Writing and Refining Long-Form Content with AI Assistants",
                    "Crafting High-Converting Ad Copy and Social Media Posts",
                    "Using AI for Keyword Research and On-Page SEO"
                ]
            },
            {
                title: "Module 3: Visual Creation with Midjourney",
                lessons: [
                    "Mastering the Midjourney Prompt: Style, Lighting, and Composition",
                    "Creating Consistent Characters and Branding Assets",
                    "Advanced Techniques: Inpainting, Outpainting, and Style Tuning",
                    "From Image to Ad Creative: A Practical Workflow"
                ]
            },
            {
                title: "Module 4: AI Video Production",
                lessons: [
                    "Introduction to AI Video Generation (Kling, Runway, Sora)",
                    "Creating Short-Form Video Content from a Single Prompt",
                    "AI Voice Cloning and Custom Avatars (HeyGen)",
                    "Capstone Project: Launch a Full AI-Generated Ad Campaign"
                ]

            }
        ]
    },
    {
        id: "bp-2",
        title: "Agentic Workflows with n8n",
        subtitle: "Go beyond simple automation. Learn to build, test, and deploy complex, multi-step AI agents that can perform tasks autonomously for your business.",
        category: "Business & Productivity",
        level: "Advanced",
        duration: "12 Hours of Video",
        price: 499,
        imageUrl: "https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        learningOutcomes: "This course is for those who want to build, not just use. You will learn the fundamentals of agentic design, how to connect AI models to external tools and APIs, and how to manage state and memory. You will build a fully functional agent that can perform a real-world business task.",
        modules: [
            {
                title: "Module 1: Foundations of Agentic Design",
                lessons: [
                    "What is an AI Agent? (vs. a simple prompt)",
                    "Core Components: LLMs, Tools, and Memory",
                    "Introduction to n8n: Your Visual Automation Canvas",
                    "Setting Up Secure Connections and Credentials"
                ]
            },
            {
                title: "Module 2: Building Your First Agent",
                lessons: [
                    "The 'ReAct' Framework: Reason and Act",
                    "Giving Your Agent Tools: Web Search and API Calls",
                    "Basic Memory: Storing and Retrieving Information",
                    "Project: Build a Research Agent that Summarizes News Articles"
                ]
            },
            {
                title: "Module 3: Advanced Agentic Systems",
                lessons: [
                    "Introduction to Vector Databases for Long-Term Memory",
                    "Creating RAG (Retrieval-Augmented Generation) Agents",
                    "Error Handling and Self-Correction Loops",
                    "Deploying and Monitoring Your n8n Workflows"
                ]
            },
            {
                title: "Module 4: Multi-Agent Collaboration",
                lessons: [
                    "Designing Specialized Agents (e.g., a 'Writer' agent and a 'Critic' agent)",
                    "Orchestrating Communication Between Agents",
                    "Hierarchical Agent Structures",
                    "Capstone Project: Build a Multi-Agent System to Plan a Marketing Campaign"
                ]
            }
        ]
    }


    // We can add the other detailed course curricula here as they are developed.
];

/**
 * A helper function to find and return the full details for a single course.
 * @param {string} courseId - The ID of the course to find.
 * @returns {object|undefined} The full course object or undefined if not found.
 */
export function getCourseDetailsById(courseId) {
    return detailedCourseData.find(course => course.id === courseId);
}