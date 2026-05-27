import axios from "axios";

export async function POST(req: Request) {
  const { start, end } = await req.json();
  
  const response = await axios.post(
    `https://n8n.gerard-portfolio.com/webhook-test/travel-directions`,
    {
      start,
      end,
    }
  );
  
  const data = response.data;
  
  return Response.json({
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: data.routes[0].geometry,
        properties: {
          distance: data.routes[0].distance,
          duration: data.routes[0].duration,
        },
      },
    ],
  });
}
