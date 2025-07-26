// /src/services/mockData.js

// This file is the single source of truth for our blog content.
// Both the BlogPage and SinglePostPage will import this array.
// To add a new blog post, you will only need to add it here.

export const allBlogPosts = [
    {
        id: "post-1",
        category: "Future Forward",
        title: "The 'AI Skills Gap' is Here. Here's How to Get Ahead.",
        date: "July 24, 2024",
        link: "/#/blog/post-1",
        imageUrl: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        isFeatured: true,
        content: `
            <h2>The New Gold Rush</h2>
            <p>The rise of generative AI has created a modern-day gold rush, but the most valuable resource isn't code—it's the ability to effectively communicate with and command these powerful new models. This "AI Skills Gap" represents the single greatest opportunity for professional advancement in the next decade.</p>
            <blockquote>"The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn." - Alvin Toffler</blockquote>
            <p>This quote has never been more relevant. As AI automates routine tasks, the demand for individuals who can creatively and strategically apply AI to complex problems is skyrocketing.</p>
            <h3>What is the AI Skills Gap?</h3>
            <p>It's the chasm between the capabilities of modern AI systems and the workforce's ability to leverage them. Many companies now have access to powerful tools like GPT-4o and Claude 3.5, but they lack the internal talent to transform that raw power into tangible business value. This is where Nexus Academy comes in.</p>
        `
    },
    {
        id: "post-2",
        category: "Tool Spotlight",
        title: "Kling vs. Sora vs. Runway: Which AI Video Tool is Right for You?",
        date: "July 22, 2024",
        link: "/#/blog/post-2",
        imageUrl: "https://images.pexels.com/photos/7567528/pexels-photo-7567528.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: `<h2>A New Era of Video</h2><p>Content for post 2...</p>`
    },
    {
        id: "post-3",
        category: "Workflow Wednesday",
        title: "How to Build a Custom GPT to Analyze Customer Feedback",
        date: "July 17, 2024",
        link: "/#/blog/post-3",
        imageUrl: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: `<h2>Listen to Your Users</h2><p>Content for post 3...</p>`
    },
    {
        id: "post-4",
        category: "Productivity",
        title: "5 AI-Powered Tools to Automate Your Inbox and Reclaim Your Time",
        date: "July 12, 2024",
        link: "/#/blog/post-4",
        imageUrl: "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: `<h2>Inbox Zero, Powered by AI</h2><p>Content for post 4...</p>`
    },
    {
        id: "post-5",
        category: "Future Forward",
        title: "Agentic AI: The Next Frontier Beyond Simple Prompts",
        date: "July 10, 2024",
        link: "/#/blog/post-5",
        imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: `<h2>Beyond Simple Prompts</h2><p>Content for post 5...</p>`
    },
    {
        id: "post-6",
        category: "Tool Spotlight",
        title: "A Deep Dive into Claude 3.5 Sonnet: Is It a GPT-4o Killer?",
        date: "July 05, 2024",
        link: "/#/blog/post-6",
        imageUrl: "https://images.pexels.com/photos/163064/play-stone-network-networked-163064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        content: `<h2>A New Challenger Appears</h2><p>Content for post 6...</p>`
    }
];