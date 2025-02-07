import { startUdpServer, createResponse, createTxtAnswer } from "denamed";
import { GoogleGenerativeAI } from "@google/generative-ai"
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY || '';

startUdpServer(async (query): Promise<any> => {
    const question = query.questions ? query.questions[0] : null;
    const prompt = question ? question.name.split('.').join(' ') : '';
    // console.log(`Received query: ${prompt}`);
    const ai = new GoogleGenerativeAI(API_KEY);
    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
    const result = await model.generateContent("Answer the question in a word or sentence: " + prompt);
    // console.log(`Response: ${result.response.text()}`);
    if (query.questions) {
        return createResponse(query, [createTxtAnswer(query.questions[0], result.response.text())]);
    } else {
        return createResponse(query, []);
    }
}, { port : 8000 });