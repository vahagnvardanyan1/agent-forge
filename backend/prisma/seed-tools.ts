import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding tool definitions and agent templates...');

  // Tool 1: Web Search
  await prisma.toolDefinition.upsert({
    where: { name: 'web_search' },
    update: {},
    create: {
      name: 'web_search',
      displayName: 'Web Search',
      description: 'Search the web for current information using Google',
      category: 'search',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
        required: ['query'],
      },
      steps: [
        {
          name: 'search',
          type: 'http',
          config: {
            method: 'GET',
            url: 'https://serpapi.com/search',
            params: {
              engine: 'google',
              q: '{{input.query}}',
              api_key: '{{auth.apiKey}}',
              num: '5',
            },
            responseMapping: 'organic_results',
          },
        },
      ],
      outputMapping: '{{steps.search.output}}',
      requiresAuth: true,
      authConfig: { envVar: 'SERP_API_KEY' },
      isBuiltIn: true,
    },
  });
  console.log('Created tool: web_search');

  // Tool 2: Job Search (multi-step)
  await prisma.toolDefinition.upsert({
    where: { name: 'job_search' },
    update: {},
    create: {
      name: 'job_search',
      displayName: 'Job Search',
      description:
        'Search for job listings across LinkedIn, Indeed, Glassdoor, ZipRecruiter and more. Returns job title, company, location, description, salary info, and application links.',
      category: 'search',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description:
              "Job title or keywords, e.g. 'Senior React Developer'",
          },
          location: {
            type: 'string',
            description:
              "Location for job search, e.g. 'San Francisco, CA', 'Remote', or 'United States'. Defaults to 'United States' if not specified by user.",
          },
          date_posted: {
            type: 'string',
            description:
              "Recency filter as a chips value, e.g. 'date_posted:today', 'date_posted:3days', 'date_posted:week', 'date_posted:month'. Leave empty for all dates.",
          },
        },
        required: ['query', 'location'],
      },
      steps: [
        {
          name: 'fetch_jobs',
          type: 'http',
          config: {
            method: 'GET',
            url: 'https://serpapi.com/search',
            params: {
              engine: 'google_jobs',
              q: '{{input.query}}',
              location: '{{input.location}}',
              chips: '{{input.date_posted}}',
              api_key: '{{auth.apiKey}}',
            },
            responseMapping: 'jobs_results',
          },
        },
        {
          name: 'format_results',
          type: 'transform',
          config: {
            template:
              'Found jobs from Google Jobs (aggregating LinkedIn, Indeed, Glassdoor, ZipRecruiter):\n\n{{steps.fetch_jobs.output}}',
          },
        },
      ],
      outputMapping: '{{steps.format_results.output}}',
      requiresAuth: true,
      authConfig: { envVar: 'SERP_API_KEY' },
      isBuiltIn: true,
    },
  });
  console.log('Created tool: job_search');

  // Tool 3: Resume Analyzer (LLM step)
  await prisma.toolDefinition.upsert({
    where: { name: 'resume_analyzer' },
    update: {},
    create: {
      name: 'resume_analyzer',
      displayName: 'Resume Analyzer',
      description:
        'Analyze resume text to extract skills, experience years, job titles, education, certifications, and seniority level as structured data',
      category: 'utility',
      inputSchema: {
        type: 'object',
        properties: {
          resume_text: {
            type: 'string',
            description: 'Full resume text to analyze',
          },
        },
        required: ['resume_text'],
      },
      steps: [
        {
          name: 'extract',
          type: 'llm',
          config: {
            systemPrompt:
              "You are a resume parsing expert. Extract structured data from the resume. Return ONLY a JSON object with these fields: skills (string[]), experienceYears (number), jobTitles (string[]), education (string[]), certifications (string[]), industries (string[]), seniorityLevel ('entry'|'mid'|'senior'|'lead'). Be precise and thorough.",
            userPrompt: '{{input.resume_text}}',
            temperature: 0.1,
          },
        },
      ],
      outputMapping: '{{steps.extract.output}}',
      requiresAuth: false,
      isBuiltIn: true,
    },
  });
  console.log('Created tool: resume_analyzer');

  // Tool 4: Company Research (multi-step: search + summarize)
  await prisma.toolDefinition.upsert({
    where: { name: 'company_research' },
    update: {},
    create: {
      name: 'company_research',
      displayName: 'Company Research',
      description:
        'Research a company to find information about their size, culture, tech stack, funding, and employee reviews',
      category: 'search',
      inputSchema: {
        type: 'object',
        properties: {
          company_name: {
            type: 'string',
            description: 'Company name',
          },
          aspect: {
            type: 'string',
            description:
              "Focus area: 'overview', 'culture', 'salary', 'tech_stack', 'reviews'",
          },
        },
        required: ['company_name'],
      },
      steps: [
        {
          name: 'search_info',
          type: 'http',
          config: {
            method: 'GET',
            url: 'https://serpapi.com/search',
            params: {
              engine: 'google',
              q: '{{input.company_name}} {{input.aspect}} company information',
              api_key: '{{auth.apiKey}}',
              num: '5',
            },
            responseMapping: 'organic_results',
          },
        },
        {
          name: 'summarize',
          type: 'llm',
          config: {
            systemPrompt:
              "You are a company research analyst. Summarize the search results about the company. Focus on facts: size, industry, funding, culture, tech stack, reviews. Be concise and factual. If info isn't available, say so.",
            userPrompt:
              'Company: {{input.company_name}}\nFocus: {{input.aspect}}\n\nSearch Results:\n{{steps.search_info.output}}',
          },
        },
      ],
      outputMapping: '{{steps.summarize.output}}',
      requiresAuth: true,
      authConfig: { envVar: 'SERP_API_KEY' },
      isBuiltIn: true,
    },
  });
  console.log('Created tool: company_research');

  // Tool 5: Calculator
  await prisma.toolDefinition.upsert({
    where: { name: 'calculator' },
    update: {},
    create: {
      name: 'calculator',
      displayName: 'Calculator',
      description: 'Perform arithmetic calculations safely',
      category: 'utility',
      inputSchema: {
        type: 'object',
        properties: {
          expression: {
            type: 'string',
            description: "Math expression, e.g. '(50000 * 1.15) - 45000'",
          },
        },
        required: ['expression'],
      },
      steps: [
        {
          name: 'calculate',
          type: 'code',
          config: { handler: 'calculator' },
        },
      ],
      outputMapping: '{{steps.calculate.output}}',
      requiresAuth: false,
      isBuiltIn: true,
    },
  });
  console.log('Created tool: calculator');

  // Agent Template: Work Finder
  await prisma.agentTemplate.upsert({
    where: { name: 'work-finder' },
    update: {},
    create: {
      name: 'work-finder',
      displayName: 'Work Finder',
      description:
        'AI job search assistant that finds positions across LinkedIn, Indeed, Glassdoor. Analyzes your resume, matches skills to requirements, and provides career insights.',
      category: 'career',
      systemPrompt: `You are an expert career advisor and job search assistant. You help people find the best job opportunities matched to their skills and experience.

IMPORTANT: You MUST use your tools to answer user requests. When a user asks you to find jobs, IMMEDIATELY call the job_search tool. Do NOT ask clarifying questions before searching — search first, then refine.

## Your Tools
- **job_search**: Search real job listings across LinkedIn, Indeed, Glassdoor, ZipRecruiter, and more
- **resume_analyzer**: Extract structured skills, experience, and qualifications from resume text
- **web_search**: Research salary data, job market trends, and general information
- **company_research**: Deep-dive into a specific company's culture, tech stack, funding, and reviews
- **calculator**: Salary calculations, comparisons, and cost-of-living adjustments

## How You Work

### When a user asks to find jobs:
1. IMMEDIATELY call **job_search** with whatever information they gave you — do not ask questions first
2. Present the results with analysis
3. After showing results, offer to refine the search or ask about preferences

### When a user shares a resume or describes their background:
1. Use **resume_analyzer** to extract their skills, experience, and qualifications
2. Summarize what you found and confirm with the user
3. Then use **job_search** to find matching positions

### When the user asks about a company:
1. Use **company_research** to gather info on size, culture, tech stack, funding
2. Present factual findings with honest assessment

### When discussing salary:
1. Use **web_search** to find current salary data for the role + location
2. Use **calculator** for comparisons and cost-of-living adjustments
3. Provide context: market range, where the user falls, negotiation suggestions

## Presenting Job Results
For each job found, provide:
- **Match Score**: Strong Match / Good Match / Partial Match (if user background is known)
- **Key Details**: Title, company, location, salary (if available)
- **Why This Role**: Brief note on why it could be a good fit

## Important Rules
- ALWAYS use tools to answer questions — never give generic advice without searching first
- Be honest about match quality — never oversell a weak match
- Suggest adjacent roles the user might not have considered
- Proactively mention skill gaps as growth opportunities, not negatives`,
      provider: 'OPENAI',
      model: 'gpt-4o',
      temperature: 0.3,
      maxTokens: 4096,
      toolNames: [
        'job_search',
        'resume_analyzer',
        'web_search',
        'company_research',
        'calculator',
      ],
    },
  });
  console.log('Created agent template: work-finder');

  console.log('Tool and template seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
