const fs = require('fs');
const https = require('https');
const path = require('path');

const NOTION_KEY = process.env.NOTION_KEY;
const PAGE_ID = '3607223f-d7c2-8057-8152-c1dfd34f9346';

if (!NOTION_KEY) {
  console.error("No NOTION_KEY env var found!");
  process.exit(1);
}

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Authorization': `Bearer ${NOTION_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    };
    const req = https.request(url, {
      method: options.method || 'GET',
      headers: { ...defaultHeaders, ...options.headers }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function getBlockChildren(blockId) {
  let results = [];
  let startCursor = undefined;
  let hasMore = true;

  while (hasMore) {
    let url = `https://api.notion.com/v1/blocks/${blockId}/children?page_size=100`;
    if (startCursor) {
      url += `&start_cursor=${startCursor}`;
    }
    const response = await request(url);
    if (response.results) {
      results.push(...response.results);
    }
    hasMore = response.has_more;
    startCursor = response.next_cursor;
  }
  return results;
}

function getBlockText(block) {
  const type = block.type;
  if (!block[type]) return '';
  const richText = block[type].rich_text;
  if (!richText) return '';
  return richText.map(t => t.plain_text).join('');
}

async function renderBlock(block, indent = 0) {
  const spaces = '  '.repeat(indent);
  const type = block.type;
  let md = '';

  switch (type) {
    case 'heading_1':
      md += `${spaces}# ${getBlockText(block)}\n\n`;
      break;
    case 'heading_2':
      md += `${spaces}## ${getBlockText(block)}\n\n`;
      break;
    case 'heading_3':
      md += `${spaces}### ${getBlockText(block)}\n\n`;
      break;
    case 'paragraph':
      const txt = getBlockText(block);
      if (txt.trim()) {
        md += `${spaces}${txt}\n\n`;
      } else {
        md += `\n`;
      }
      break;
    case 'bulleted_list_item':
      md += `${spaces}- ${getBlockText(block)}\n`;
      break;
    case 'numbered_list_item':
      md += `${spaces}1. ${getBlockText(block)}\n`;
      break;
    case 'to_do':
      const checked = block.to_do.checked ? '[x]' : '[ ]';
      md += `${spaces}- ${checked} ${getBlockText(block)}\n`;
      break;
    case 'toggle':
      md += `${spaces}> **${getBlockText(block)}** (Toggle)\n`;
      break;
    case 'image':
      const imgType = block.image.type;
      const imgUrl = imgType === 'external' ? block.image.external.url : block.image.file.url;
      const caption = block.image.caption ? block.image.caption.map(t => t.plain_text).join('') : 'Image';
      md += `${spaces}![${caption}](${imgUrl})\n\n`;
      break;
    case 'bookmark':
      md += `${spaces}[Bookmark: ${block.bookmark.url}](${block.bookmark.url})\n\n`;
      break;
    case 'file':
      const fileUrl = block.file.type === 'external' ? block.file.external.url : block.file.file.url;
      md += `${spaces}[File: ${fileUrl}](${fileUrl})\n\n`;
      break;
    case 'divider':
      md += `${spaces}---\n\n`;
      break;
    case 'code':
      md += `${spaces}\`\`\`${block.code.language || ''}\n${block.code.rich_text.map(t => t.plain_text).join('')}\n\`\`\`\n\n`;
      break;
    case 'quote':
      md += `${spaces}> ${getBlockText(block)}\n\n`;
      break;
    case 'callout':
      md += `${spaces}> [!NOTE]\n${spaces}> ${getBlockText(block)}\n\n`;
      break;
    default:
      const fallback = getBlockText(block);
      if (fallback) {
        md += `${spaces}${fallback}\n\n`;
      }
      break;
  }

  if (block.has_children) {
    const children = await getBlockChildren(block.id);
    for (const child of children) {
      md += await renderBlock(child, indent + 1);
    }
  }

  return md;
}

async function run() {
  console.log("Starting recursive fetch of page...");
  const children = await getBlockChildren(PAGE_ID);
  let fullMarkdown = '';
  for (const child of children) {
    fullMarkdown += await renderBlock(child);
  }
  fs.writeFileSync(path.join(__dirname, 'notion_notes_dump.md'), fullMarkdown);
  console.log("Successfully wrote output to " + path.join(__dirname, 'notion_notes_dump.md'));
}

run().catch(console.error);
