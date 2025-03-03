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
            status: 200 | 400 | 500;
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
}, "/documents">, "/">;

type AppRouter = typeof router;

export type { AppRouter };
