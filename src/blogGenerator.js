export async function generateBlogPost(openai, topic) {
  const prompt = `Write a comprehensive blog post about: ${topic.title}\n\nContext: ${topic.description}\n\nThe blog post should be informative, engaging, and well-structured with proper headings, paragraphs, and a conclusion. Include relevant insights and analysis.`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4",
    temperature: 0.7,
    max_tokens: 1500
  });

  return {
    title: topic.title,
    content: completion.choices[0].message.content,
    sourceUrl: topic.url,
    timestamp: new Date().toISOString()
  };
}