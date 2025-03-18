import * as hono_hono_base from 'hono/hono-base';
import * as hono_utils_http_status from 'hono/utils/http-status';
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
}, "/clerk"> | hono_types.MergeSchemaPath<{
    "/inbound/:postboxId": {
        $post: {
            input: {
                json: {
                    Date: string;
                    From: string;
                    MailboxHash: string;
                    MessageStream: string;
                    FromName: string;
                    FromFull: {
                        Name: string;
                        Email: string;
                        MailboxHash: string;
                    };
                    To: string;
                    ToFull: {
                        Name: string;
                        Email: string;
                        MailboxHash: string;
                    }[];
                    Cc: string;
                    CcFull: {
                        Name: string;
                        Email: string;
                        MailboxHash: string;
                    }[];
                    Bcc: string;
                    BccFull: {
                        Name: string;
                        Email: string;
                        MailboxHash: string;
                    }[];
                    OriginalRecipient: string;
                    ReplyTo: string;
                    Subject: string;
                    MessageID: string;
                    TextBody: string;
                    HtmlBody: string;
                    StrippedTextReply: string;
                    Tag: string;
                    Headers: {
                        Name: string;
                        Value: string;
                    }[];
                    Attachments: {
                        ContentLength: number;
                        ContentType: string;
                        Name: string;
                        Content: string;
                        ContentID: string;
                    }[];
                };
            } & {
                param: {
                    postboxId: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/email">, "/webhooks"> | hono_types.MergeSchemaPath<{
    "/uploads": {
        $post: {
            input: {
                json: {
                    file_name: string;
                };
            };
            output: {
                createdAt: string;
                updatedAt: string;
                type: "invoice" | "receipt" | "unknown";
                id: string;
                organizationId: string;
                archivedAt: string | null;
                fileName: string;
                storagePath: string;
                processingStatus: "waiting_for_upload" | "processing" | "completed" | "failed";
                emailId?: string | undefined;
                storageResource?: {
                    putUrl: string;
                    getUrl: string;
                } | undefined;
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
                createdAt: string;
                updatedAt: string;
                id: string;
                organizationId: string;
                archivedAt: string | null;
                documentId: string;
                items: {
                    createdAt: string;
                    updatedAt: string;
                    id: string;
                    organizationId: string;
                    archivedAt: string | null;
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
                subTotal?: {
                    matchedContent: string;
                    confidence: number;
                    currency: {
                        amount: number;
                        currencyCode: string;
                    };
                } | undefined;
                totalTax?: {
                    matchedContent: string;
                    confidence: number;
                    currency: {
                        amount: number;
                        currencyCode: string;
                    };
                } | undefined;
                invoiceNumber?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                matchedVendorName?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                invoiceDate?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                paymentTerm?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                vendorTaxId?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                matchedCustomerName?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                invoiceTotal?: {
                    matchedContent: string;
                    confidence: number;
                    currency: {
                        amount: number;
                        currencyCode: string;
                    };
                } | undefined;
                customerTaxId?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                matchedPurchaseOrderNumber?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                document?: {
                    createdAt: string;
                    updatedAt: string;
                    type: "invoice" | "receipt" | "unknown";
                    id: string;
                    organizationId: string;
                    archivedAt: string | null;
                    fileName: string;
                    storagePath: string;
                    processingStatus: "waiting_for_upload" | "processing" | "completed" | "failed";
                    emailId?: string | undefined;
                    storageResource?: {
                        putUrl: string;
                        getUrl: string;
                    } | undefined;
                } | undefined;
            }[];
            outputFormat: "json";
            status: hono_utils_http_status.ContentfulStatusCode;
        };
    };
} & {
    "/:invoiceId": {
        $get: {
            input: {
                param: {
                    invoiceId: string;
                };
            };
            output: {
                createdAt: string;
                updatedAt: string;
                id: string;
                organizationId: string;
                archivedAt: string | null;
                documentId: string;
                items: {
                    createdAt: string;
                    updatedAt: string;
                    id: string;
                    organizationId: string;
                    archivedAt: string | null;
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
                subTotal?: {
                    matchedContent: string;
                    confidence: number;
                    currency: {
                        amount: number;
                        currencyCode: string;
                    };
                } | undefined;
                totalTax?: {
                    matchedContent: string;
                    confidence: number;
                    currency: {
                        amount: number;
                        currencyCode: string;
                    };
                } | undefined;
                invoiceNumber?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                matchedVendorName?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                invoiceDate?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                paymentTerm?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                vendorTaxId?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                matchedCustomerName?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                invoiceTotal?: {
                    matchedContent: string;
                    confidence: number;
                    currency: {
                        amount: number;
                        currencyCode: string;
                    };
                } | undefined;
                customerTaxId?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                matchedPurchaseOrderNumber?: {
                    value: string;
                    matchedContent: string;
                    confidence: number;
                } | undefined;
                document?: {
                    createdAt: string;
                    updatedAt: string;
                    type: "invoice" | "receipt" | "unknown";
                    id: string;
                    organizationId: string;
                    archivedAt: string | null;
                    fileName: string;
                    storagePath: string;
                    processingStatus: "waiting_for_upload" | "processing" | "completed" | "failed";
                    emailId?: string | undefined;
                    storageResource?: {
                        putUrl: string;
                        getUrl: string;
                    } | undefined;
                } | undefined;
            };
            outputFormat: "json";
            status: hono_utils_http_status.ContentfulStatusCode;
        };
    };
}, "/invoices"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                createdAt: string;
                updatedAt: string;
                id: string;
                name: string;
                organizationId: string;
                postmarkServerId: number | null;
                postmarkInboundEmail: string | null;
                archivedAt: string | null;
            }[];
            outputFormat: "json";
            status: hono_utils_http_status.ContentfulStatusCode;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    name: string;
                    organizationId: string;
                };
            };
            output: {
                createdAt: string;
                updatedAt: string;
                id: string;
                name: string;
                organizationId: string;
                postmarkServerId: number | null;
                postmarkInboundEmail: string | null;
                archivedAt: string | null;
            };
            outputFormat: "json";
            status: hono_utils_http_status.ContentfulStatusCode;
        };
    };
}, "/postboxes"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    includeArchived?: "true" | "false" | undefined;
                };
            };
            output: {
                createdAt: string;
                updatedAt: string;
                status: "received" | "failed" | "processed" | "partial_processed" | "archived";
                id: string;
                date: string;
                organizationId: string;
                postboxId: string;
                from: string;
                fromName: string;
                to: string;
                cc: string;
                bcc: string;
                subject: string;
                messageId: string;
                bodyText: string;
                bodyHtml: string;
                archivedAt: string | null;
                documents?: {
                    createdAt: string;
                    updatedAt: string;
                    type: "invoice" | "receipt" | "unknown";
                    id: string;
                    organizationId: string;
                    archivedAt: string | null;
                    fileName: string;
                    storagePath: string;
                    processingStatus: "waiting_for_upload" | "processing" | "completed" | "failed";
                    emailId?: string | undefined;
                    storageResource?: {
                        putUrl: string;
                        getUrl: string;
                    } | undefined;
                }[] | undefined;
                postbox?: {
                    createdAt: string;
                    updatedAt: string;
                    id: string;
                    name: string;
                    organizationId: string;
                    postmarkServerId: number | null;
                    postmarkInboundEmail: string | null;
                    archivedAt: string | null;
                } | undefined;
            }[];
            outputFormat: "json";
            status: hono_utils_http_status.ContentfulStatusCode;
        };
    };
} & {
    "/:emailId": {
        $get: {
            input: {
                param: {
                    emailId: string;
                };
            } & {
                query: {
                    withDetails?: "true" | "false" | undefined;
                };
            };
            output: {
                createdAt: string;
                updatedAt: string;
                status: "received" | "failed" | "processed" | "partial_processed" | "archived";
                id: string;
                date: string;
                organizationId: string;
                postboxId: string;
                from: string;
                fromName: string;
                to: string;
                cc: string;
                bcc: string;
                subject: string;
                messageId: string;
                bodyText: string;
                bodyHtml: string;
                archivedAt: string | null;
                documents?: {
                    createdAt: string;
                    updatedAt: string;
                    type: "invoice" | "receipt" | "unknown";
                    id: string;
                    organizationId: string;
                    archivedAt: string | null;
                    fileName: string;
                    storagePath: string;
                    processingStatus: "waiting_for_upload" | "processing" | "completed" | "failed";
                    emailId?: string | undefined;
                    storageResource?: {
                        putUrl: string;
                        getUrl: string;
                    } | undefined;
                }[] | undefined;
                postbox?: {
                    createdAt: string;
                    updatedAt: string;
                    id: string;
                    name: string;
                    organizationId: string;
                    postmarkServerId: number | null;
                    postmarkInboundEmail: string | null;
                    archivedAt: string | null;
                } | undefined;
            };
            outputFormat: "json";
            status: hono_utils_http_status.ContentfulStatusCode;
        };
    };
} & {
    "/:emailId/archive": {
        $post: {
            input: {
                param: {
                    emailId: string;
                };
            };
            output: {
                createdAt: string;
                updatedAt: string;
                status: "received" | "failed" | "processed" | "partial_processed" | "archived";
                id: string;
                date: string;
                organizationId: string;
                postboxId: string;
                from: string;
                fromName: string;
                to: string;
                cc: string;
                bcc: string;
                subject: string;
                messageId: string;
                bodyText: string;
                bodyHtml: string;
                archivedAt: string | null;
                documents?: {
                    createdAt: string;
                    updatedAt: string;
                    type: "invoice" | "receipt" | "unknown";
                    id: string;
                    organizationId: string;
                    archivedAt: string | null;
                    fileName: string;
                    storagePath: string;
                    processingStatus: "waiting_for_upload" | "processing" | "completed" | "failed";
                    emailId?: string | undefined;
                    storageResource?: {
                        putUrl: string;
                        getUrl: string;
                    } | undefined;
                }[] | undefined;
                postbox?: {
                    createdAt: string;
                    updatedAt: string;
                    id: string;
                    name: string;
                    organizationId: string;
                    postmarkServerId: number | null;
                    postmarkInboundEmail: string | null;
                    archivedAt: string | null;
                } | undefined;
            };
            outputFormat: "json";
            status: hono_utils_http_status.ContentfulStatusCode;
        };
    };
}, "/inboundEmails">, "/">;

type AppRouter = typeof router;

export type { AppRouter };
