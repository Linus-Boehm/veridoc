import * as hono_hono_base from 'hono/hono-base';
import * as hono_types from 'hono/types';

declare const router: hono_hono_base.HonoBase<{}, hono_types.BlankSchema | hono_types.MergeSchemaPath<{
    "/health": {
        $get: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
}, "/monitoring"> | hono_types.MergeSchemaPath<hono_types.BlankSchema | hono_types.MergeSchemaPath<{
    "/": {
        $post: {
            input: {};
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500 | 200 | 400;
        };
    };
}, "/clerk">, "/webhooks"> | hono_types.MergeSchemaPath<{
    "/uploads": {
        $post: {
            input: {
                json: {
                    file_name: string;
                };
            };
            output: {
                storageResource: {
                    putUrl: string;
                    getUrl: string;
                } | undefined;
                id: string;
                type: "invoice" | "receipt" | "unknown";
                organizationId: string;
                fileName: string;
                storagePath: string;
                processingStatus: "waiting_for_upload" | "processing" | "completed" | "failed";
            };
            outputFormat: "json";
            status: 201;
        };
    };
} & {
    "/upload-acknoledge": {
        $post: {
            input: {
                json: {
                    key: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 201;
        };
    };
}, "/documents"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                id: string;
                documentId: string;
                document: {
                    storageResource: {
                        putUrl: string;
                        getUrl: string;
                    } | undefined;
                    id: string;
                    type: "invoice" | "receipt" | "unknown";
                    organizationId: string;
                    fileName: string;
                    storagePath: string;
                    processingStatus: "waiting_for_upload" | "processing" | "completed" | "failed";
                } | undefined;
                items: {
                    id: string;
                    organizationId: string;
                    position: number;
                    matchedRowContent: string;
                    confidence: number;
                    date?: {
                        value: string;
                        matchedContent: string;
                        confidence: number;
                    } | undefined;
                    description?: {
                        value: string;
                        matchedContent: string;
                        confidence: number;
                    } | undefined;
                    unit?: {
                        value: string;
                        matchedContent: string;
                        confidence: number;
                    } | undefined;
                    quantity?: {
                        value: number;
                        matchedContent: string;
                        confidence: number;
                    } | undefined;
                    taxRate?: {
                        value: string;
                        matchedContent: string;
                        confidence: number;
                    } | undefined;
                    productCode?: {
                        value: string;
                        matchedContent: string;
                        confidence: number;
                    } | undefined;
                    amount?: {
                        matchedContent: string;
                        confidence: number;
                        currency: {
                            amount: number;
                            currencyCode: string;
                        };
                    } | undefined;
                    unitPrice?: {
                        matchedContent: string;
                        confidence: number;
                        currency: {
                            amount: number;
                            currencyCode: string;
                        };
                    } | undefined;
                    tax?: {
                        matchedContent: string;
                        confidence: number;
                        currency: {
                            amount: number;
                            currencyCode: string;
                        };
                    } | undefined;
                }[];
                organizationId: string;
            }[];
            outputFormat: "json";
            status: 200;
        };
    };
}, "/invoices">, "/">;

type AppRouter = typeof router;

export type { AppRouter };
