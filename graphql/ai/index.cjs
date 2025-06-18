const { GoogleGenAI } = require("@google/genai");
const connection = require("../database");
const fs = require("fs");
const path = require("path");
const { setGlobalDispatcher, ProxyAgent } = require("undici");

if (process.env.https_proxy) {
  const dispatcher = new ProxyAgent({
    uri: new URL(process.env.https_proxy).toString(),
  });
  //全局fetch调用启用代理
  setGlobalDispatcher(dispatcher);
}

const { GEMINI_API_KEY } = process.env;

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

async function generateSummary(postId, preContent) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: preContent,
      config: {
        systemInstruction:
          "作为一名经验丰富的编辑，你负责为博客文章撰写摘要。请基于用户给出的文章内容，生成一份中文总结，要求摘要准确、完整，且总字数不超过200字。确保总结只包含文章的关键信息，不做任何额外解读。",
        temperature: 0.3,
      },
    });
    console.log(`Post ID: ${postId}, Summary: ${response.text}`);
    const summary = response.text;
    const insertSummaryTableSql = `INSERT INTO blog_ai_summaries (blog_post_id, summary_text) 
    VALUES (?, ?);`;
    const [res] = await connection.execute(insertSummaryTableSql, [
      postId,
      summary,
    ]);
    return res;
  } catch (error) {
    console.error(`Error generating summary for post ID ${postId}:`, error);
  }
}

async function main() {
  const queryPostsSql = `SELECT id, content FROM blog_posts`;
  const [posts] = await connection.execute(queryPostsSql);
  // 遍历每个文章，生成摘要
  for (const post of posts) {
    try {
      const content = fs.readFileSync(
        path.join(process.cwd(), "uploads/blog", `${post.content}`),
        "utf-8"
      );
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
        config: {
          systemInstruction:
            "作为一名经验丰富的编辑，你负责为博客文章撰写摘要。请基于用户给出的文章内容，生成一份中文总结，要求摘要准确、完整，且总字数不超过200字。确保总结只包含文章的关键信息，不做任何额外解读。",
          temperature: 0.3,
        },
      });
      console.log(`Post ID: ${post.id}, Summary: ${response.text}`);
      const summary = response.text;
      const insertSummaryTableSql = `INSERT INTO blog_ai_summaries (blog_post_id, summary_text)
      VALUES (?, ?);`;
      const [res] = await connection.execute(insertSummaryTableSql, [
        post.id,
        summary,
      ]);
    } catch (error) {
      console.error(`Error processing post ID ${post.id}:`, error);
    }
  }
}

module.exports = {
  generateSummary,
};
