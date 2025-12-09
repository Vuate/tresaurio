export async function GET() {
  try {
    const API_KEY = process.env.NEWSDATA_KEY;

    const res = await fetch(
      `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=crypto&language=en`,
      { cache: "no-store" }
    );

    const json = await res.json();

    return Response.json({
      result:
        json.results?.map((item: any) => ({
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
