import express from "express";
import sql from "mssql";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
  })
);
app.use(express.json());

// Database configuration using environment variables
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: "Uprise",
    port: parseInt(process.env.DB_PORT, 10),
    options: {
      encrypt: false, // Set to true if using Azure
      trustServerCertificate: true,
    },
    requestTimeout: 50000, // Increase timeout to 50 seconds
  };

// Endpoint to fetch patients with pagination
app.get("/api/patients", async (req, res) => {
    try {
      const { page = 1, limit = 10, name = "", chartNumber = "" } = req.query;
      const offset = (page - 1) * limit;
  
      const decodedName = decodeURIComponent(name); // Decode the search parameter
      const organizationId = req.headers["organizationid"];
      
      if (!organizationId) {
        return res.status(400).send("OrganizationId header is required");
      }

      const pool = await sql.connect(dbConfig);
      const result = await pool
      .request()
      .input("name", sql.VarChar, `%${decodedName}%`)
      .input("chartNumber", sql.VarChar, `%${chartNumber || ""}%`)
      .input("organizationId", sql.VarChar, organizationId)
      .query(
        `SELECT 
          ContactID AS id,
          FirstName AS firstName, 
          LastName AS lastName, 
          Gender AS gender,
          FORMAT(BirthDate, 'yyyy-MM-dd') AS dob,
          EmergencyContactNumber AS contact,
          ContactType AS type,
          ContactStatus AS status,
          'Yes' AS local,
          'Preferred Location' AS location,
          ChartNumber AS chartNumber
        FROM Contact WITH (NOLOCK)
        WHERE 
          (CONCAT(FirstName, ' ', LastName) LIKE @name OR @name IS NULL)
          AND (ChartNumber LIKE @chartNumber OR @chartNumber IS NULL)
          AND OrganizationId = @organizationId
        ORDER BY ModifiedDate DESC
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY`
      );
  
      res.json(result.recordset);
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).send("Error fetching patients");
    }
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});