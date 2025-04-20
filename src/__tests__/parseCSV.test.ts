import { parseCSV } from "@/app/utils/parser";

describe("parseCSV", () => {
  it("should parse a CSV string into an array of patient objects", () => {
    const input = `EHR ID,Patient Name,Email,Phone,Referring Provider
001,John Doe,john@example.com,1234567890,Dr. Smith
002,Jane Roe,jane@example.com,0987654321,Dr. Adams`;

    const result = parseCSV(input);

    expect(result.data).toEqual([
      {
        ehrId: "001",
        patientName: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        referringProvider: "Dr. Smith",
      },
      {
        ehrId: "002",
        patientName: "Jane Roe",
        email: "jane@example.com",
        phone: "0987654321",
        referringProvider: "Dr. Adams",
      },
    ]);
  });

  it("should trim whitespace and handle headers in different order", () => {
    const input = `  Email , Patient Name , Phone , Referring Provider , EHR ID
john@example.com , John Doe , 1234567890 , Dr. Smith , 001`;

    const result = parseCSV(input);

    expect(result.data[0].email).toBe("john@example.com");
    expect(result.data[0].ehrId).toBe("001");
  });

  it("should return an empty array for an empty CSV string", () => {
    expect(parseCSV("").data).toEqual([]);
  });
});
