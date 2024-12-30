import dotenv from 'dotenv';
import NewsAPI from 'newsapi';
import OpenAI from 'openai';
import cron from 'node-cron';
import { generateBlogPost } from './blogGenerator.js';
import { publishBlogPost } from './publisher.js';

dotenv.config();

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getTopStory() {
  const response = await newsapi.v2.topHeadlines({
    language: 'en',
    country: 'us'
  });
  
  const topStory = response.articles[0];
  return {
    title: topStory.title,
    description: topStory.description,
    url: topStory.url
  };
}

async function generateAndPublish() {
  try {
    console.log('Fetching top story...');
    const topic = await getTopStory();
    
    console.log(`Generating blog post for: ${topic.title}`);
    const blogPost = await generateBlogPost(openai, topic);
    
    console.log('Publishing blog post...');
    await publishBlogPost(blogPost);
  } catch (error) {
    console.error('Error in blog generation process:', error);
  }
}

// Run every 6 hours
cron.schedule('0 */6 * * *', () => {
  console.log('Starting scheduled blog generation...');
  generateAndPublish();
});

// Initial run
generateAndPublish();