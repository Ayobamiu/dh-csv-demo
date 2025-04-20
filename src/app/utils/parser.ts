const toCamelCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, "") // remove special characters
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
      index === 0 ? word.toLowerCase() : word.toUpperCase()
    )
    .replace(/\s+/g, "");
};

export const parseCSV = (csvText: string) => {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  if (lines.length === 0) {
    return { data: [], headerMap: {} };
  }
  if (lines.length === 1) {
    return { data: [], headerMap: {} };
  }

  const rawHeaders = lines[0].split(",").map((header) => header.trim());
  const camelCaseHeaders = rawHeaders.map(toCamelCase);

  const headerMap = camelCaseHeaders.reduce((acc, original, index) => {
    acc[original] = rawHeaders[index];
    return acc;
  }, {} as Record<string, string>); // e.g {"camelCaseHeaders":"Camel Case Headers"}

  const data = lines.slice(1).map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const rowData: Record<string, string> = {};

    camelCaseHeaders.forEach((camelHeader, index) => {
      rowData[camelHeader] = values[index] || "";
    });

    return rowData;
  });

  return { data, headerMap };
};
