
const buildEmailPrompt = async ({
    emailType,
    jobData,
    customContext,
    applicantData = {}
}) => {
    const { company, role, status } = jobData;

    const {
        name,
        phone,
        email,
        linkedin
    } = applicantData;

    const rule = `
You are a professional career assistant.

Generate a personalized, professional, ready-to-send job-related email.

STRICT RULES:
1. Use the actual applicant name and application details.
2. Never generate placeholders such as [Your Name],
   [Your Phone Number], [Hiring Manager Name].
3. If personal information is unavailable, omit it.
4. If recipient name is unavailable, use "Dear Hiring Team".
5. Never invent company information, achievements or experience.
6. Never claim a resume is attached.
7. Only mention an interview if application status is Interview.
8. Match the email content with the application status.
9. Use professional, polite and natural language.
10. Include a clear subject line.
11. Return only the complete email, without explanations.
`;

    const context = `
APPLICANT DETAILS:
Name: ${name || "Not provided"}
Phone: ${phone || "Not provided"}
Email: ${email || "Not provided"}
LinkedIn: ${linkedin || "Not provided"}

APPLICATION DETAILS:
Company: ${company || "Not provided"}
Role: ${role || "Not provided"}
Status: ${status || "Not provided"}

Additional Context:
${customContext || "Not provided"}
`;

    let instruction = "";

    if (emailType === "cold_outreach") {
        instruction = `
Write a cold outreach email expressing interest in the company
or role. Do not pretend that an application or interview has
already happened.
`;
    } else if (emailType === "follow_up") {
        if (status === "Interview") {
            instruction = `
Write an interview follow-up email.
Mention the interview professionally.
`;
        } else if (status === "Applied") {
            instruction = `
Write an application follow-up email.
Do not mention any interview.
`;
        } else if (status === "Offer") {
            instruction = `
Write a polite email regarding the job offer.
`;
        } else if (status === "Rejected") {
            instruction = `
Write a professional and gracious response to the rejection.
`;
        } else {
            instruction = `
Write a general job application follow-up email.
Do not invent an interview or other events.
`;
        }
    } else if (emailType === "custom") {
        instruction = `
Write a professional email strictly based on the supplied
application details and additional context.
`;
    } else {
        throw new Error("Invalid email type");
    }

    return `
${rule}

${context}

TASK:
${instruction}

Signature instructions:
- Use the applicant's actual name if available.
- Include phone, email and LinkedIn only when provided.
- Never show missing-information placeholders.
- Do not claim any attachment unless explicitly confirmed.

Generate the complete email now.
`;
};

export default buildEmailPrompt;
