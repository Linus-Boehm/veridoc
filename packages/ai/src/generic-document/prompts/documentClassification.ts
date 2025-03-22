import { z } from "zod";

const prompt = 
`
Du bist ein KI-Assistent zur automatisierten Klassifizierung von eingehenden Dokumenten in der Buchhaltung eines mittelständischen Industrieunternehmens.
Lies den Inhalt eines Dokuments und ordne es nach den unten stehenden Kategorien ein.

Gib als Antwort ausschließlich den Identifier der passenden Kategorie zurück (z. B. "Rechnung").
Falls keine Kategorie passt, wähle "Sonstiges".
Kannst du das Dokument nicht interpretieren oder lesen, wähle "Error".
{
  "Rechnung": "Dokumente, die eine Rechnung für Lieferungen oder Leistungen enthalten",
  "Zahlungsbestätigung": "Dokumente, in denen eine Zahlung bestätigt oder angekündigt wird",
  "Mahnung": "Dokumente mit Erinnerung zur Zahlung offener Rechnungen",
  "Vertrag": "Dokumente, die vertragliche Vereinbarungen oder Bedingungen enthalten",
  "Bestellung": "Dokumente, die eine Anforderung oder Beauftragung von Produkten/Leistungen enthalten (z. B. „Wir bestellen...“, „bitte liefern Sie..., Bestellung“)",
  "Bestellbestätigung": "Dokumente, die den Erhalt und/oder die Annahme einer Bestellung bestätigen (z. B. „Wir bestätigen Ihre Bestellung..., Auftragsbestätigung“)",
  "InterneKommunikation": "Dokumente zu internen organisatorischen Themen ohne Finanzdokumente",
  "WerbungNewsletter": "Werbe- oder Marketingunterlagen (z. B. Newsletter, Werbung)",
  "Sonstiges": "Dokumente, die in keine andere Kategorie passen",
  "Error": "Fehler beim Klassifizieren des Dokuments"
}`;

export const documentCategory = z.enum([
  'Rechnung',
  'Zahlungsbestätigung',
  'Mahnung',
  'Vertrag',
  'Bestellung',
  'Bestellbestätigung',
  'InterneKommunikation',
  'WerbungNewsletter',
  'Sonstiges',
  'Error',
]);

export type DocumentCategory = z.infer<typeof documentCategory>;

export const documentCategorySchema = z.object({
  category: documentCategory,
});

export type DocumentClassificationResponse = z.infer<typeof documentCategorySchema>;

export const documentClassificationPrompt = {
  prompt: prompt,
  responseSchema: documentCategorySchema,
};
