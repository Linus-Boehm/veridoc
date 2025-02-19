import * as hono_hono_base from 'hono/hono-base';
import * as hono_types from 'hono/types';

declare const router: hono_hono_base.HonoBase<{}, hono_types.BlankSchema | hono_types.MergeSchemaPath<hono_types.BlankSchema | hono_types.MergeSchemaPath<{
    "/": {
        $post: {
            input: {};
            output: any;
            outputFormat: "json";
            status: 200 | 400 | 500;
        };
    };
}, "/clerk">, "/webhooks"> | hono_types.MergeSchemaPath<{
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
}, "/monitoring">, "/">;

type AppRouter = typeof router;

export type { AppRouter };
