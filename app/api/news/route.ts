interface NewsDataItem {
  title: string;
  source_id: string;
  link: string;
  image_url?: string;
  pubDate: string;
}

interface NewsDataResponse {
  results?: NewsDataItem[];
}

interface NewsItem {
  title: string;
  source: string;
  link: string;
  image?: string;
  published: string;
}

export async function GET() {
  try {
    const API_KEY = process.env.NEWSDATA_KEY;

    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=crypto&language=en`,
      { cache: "no-store" }
    );

    const json = await res.json() as NewsDataResponse;

    return Response.json({
      result:
        json.results?.map((item): NewsItem => ({
          title: item.title,
          source: item.source_id,
          link: item.link,
          image: item.image_url,
          published: item.pubDate,
        })) ?? [],
    });
  } catch (err) {
    console.error("NEWS API ERROR:", err);
    return Response.json({ result: [] });
  }
}
