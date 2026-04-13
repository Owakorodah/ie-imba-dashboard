export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.DATABASE_ID;

  if (!NOTION_TOKEN || !DATABASE_ID) {
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  try {
    let allPages = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const body = { page_size: 100 };
      if (startCursor) body.start_cursor = startCursor;

      const response = await fetch(
        `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
          },
          body: JSON.stringify(body)
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      allPages = [...allPages, ...data.results];
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    const tasks = allPages.map(page => {
      const props = page.properties;
      const get = (key, type) => {
        try {
          if (type === 'title') return props[key].title[0].text.content;
          if (type === 'select') return props[key].select?.name || '';
          if (type === 'rich_text') return props[key].rich_text[0]?.text.content || '';
          if (type === 'date') return props[key].date?.start || null;
        } catch { return ''; }
      };

      return {
        id: page.id,
        task: get('Task', 'title'),
        course: get('Course', 'select'),
        session: get('Session', 'rich_text'),
        type: get('Type', 'select'),
        priority: get('Priority', 'select'),
        notes: get('Notes', 'rich_text'),
        bucket: get('Bucket', 'select'),
        dueDate: get('Due Date', 'date')
      };
    });

    return res.status(200).json({ tasks });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
