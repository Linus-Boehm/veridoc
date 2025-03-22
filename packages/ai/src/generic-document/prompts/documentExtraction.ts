import "server-only";
import { z } from "zod";
const prompt = `
You are a highly capable AI system that extracts the contents of a PDF file and converts it into structured data while preserving the document’s hierarchy, layout, and formatting. Follow these guidelines:

1. **Segmentation & Hierarchy**  
   - Identify and preserve **headings** (e.g., title, chapters, sections, subsections) and any associated hierarchy.  
   - Extract each **paragraph** with line breaks or spacing as best as possible.  
   - Capture **lists** (bulleted or numbered) as arrays of items.

2. **Tables**  
   - Detect and preserve **tables** in a structured format.  
   - Represent each table as a JSON object containing rows, where each row is an array of cell values.  
   - If possible, also capture table headings separately.

3. **Formatting & Line Items**  
   - Maintain line and paragraph boundaries.  
   - If there are special elements (e.g., footnotes, callouts, sidebars), preserve them in a logical structure that indicates their relationship to the main text.

4. **JSON Output Format**  
   - Output the entire extracted document as **one valid JSON object**.  
   - Include keys that represent the types of content (e.g., "title", "headings", "paragraphs", "lists", "tables", "footnotes").  
   - Each key should map to a data structure that preserves the original layout:
     \`\`\`json
     {
       "title": "...",
       "sections": [
         {
           "heading": "...",
           "paragraphs": ["..."],
           "lists": [
             {
               "type": "bulleted",
               "items": ["..."]
             },
             {
               "type": "numbered",
               "items": ["..."]
             }
           ],
           "tables": [
             {
               "headers": ["...", ...],
               "rows": [
                 ["...", ...],
                 ...
               ]
             }
           ]
         },
         ...
       ],
       "footnotes": ["..."]
     }
     \`\`\`
   - Ensure the JSON is **well-formed** (valid syntax).

5. **Completeness**  
   - Strive to keep **all** text in the original PDF.  
   - Avoid truncating or summarizing.  
   - If any data cannot be identified or extracted (e.g., illegible text, embedded images with no text), label it clearly (e.g., "unreadable_text": "[unrecognized]").
   - Do keep the original document language, do not translate any text.

6. **Error Handling**  
   - Do not guess about the meaning of data you cannot parse.  
   - Indicate missing or unreadable sections explicitly.

**Final Output Requirement**  
- Respond **only** with the final JSON structure—no additional commentary outside the JSON object.
`;

const PossiblyUncertainStringSchema = z.union([
  z.string(),
  z.object({
    text: z.string(),
    confidence: z.enum(['CONFIDENT', 'UNCONFIDENT']),
  }),
]);

// A schema for table objects found in the document
const TableSchema = z.object({
  headers: z.array(PossiblyUncertainStringSchema).optional(),
  rows: z.array(z.array(PossiblyUncertainStringSchema)).optional(),
});

// A schema for list objects (supports bulleted or numbered)
const ListSchema = z.object({
  type: z.enum(['bulleted', 'numbered']),
  items: z.array(PossiblyUncertainStringSchema),
});

// A schema for each section in the document
const SectionSchema = z.object({
  heading: PossiblyUncertainStringSchema.optional(),
  paragraphs: z.array(PossiblyUncertainStringSchema).optional(),
  lists: z.array(ListSchema).optional(),
  tables: z.array(TableSchema).optional(),
});

// The overall schema for the PDF document
 const PdfDocumentSchema = z.object({
  title: PossiblyUncertainStringSchema.optional(),
  sections: z.array(SectionSchema).optional(),
  footnotes: z.array(PossiblyUncertainStringSchema).optional(),
});

export type DocumentExtractionResponse = z.infer<typeof PdfDocumentSchema>;

export const documentExtractionPrompt = {
  responseSchema: PdfDocumentSchema,
  prompt: prompt,
} as const;
