export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
  boundingbox: [string, string, string, string];
  osm_type?: "node" | "way" | "relation";
  osm_id?: number;
  geojson?: {
    type:
      | "Polygon"
      | "MultiPolygon"
      | "LineString"
      | "MultiLineString"
      | "GeometryCollection";
    coordinates?: unknown;
  };
}

export interface NominatimSearchOptions {
  query: string;
  countryCode: string;
  language: string;
}

export async function searchNominatim(
  options: NominatimSearchOptions,
): Promise<{ result: NominatimResult; requestUrl: string }> {
  const { query, countryCode, language } = options;

  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "5",
    polygon_geojson: "1",
    countrycodes: countryCode.toLowerCase(),
    addressdetails: "1",
  });

  const requestUrl = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  const response = await fetch(requestUrl, {
    headers: {
      "Accept-Language": language,
      "User-Agent": "article-site-city-polyline-map/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim: request failed (${response.status}).`);
  }

  const results = (await response.json()) as NominatimResult[];
  if (!Array.isArray(results) || results.length === 0) {
    throw new Error(`Nominatim: no result found for "${query}".`);
  }

  const result =
    results.find(
      (r) =>
        r.geojson?.type === "Polygon" || r.geojson?.type === "MultiPolygon",
    ) ?? results[0];

  return { result, requestUrl };
}
